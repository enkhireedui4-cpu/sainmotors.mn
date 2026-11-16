"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Location } from "@/content/types";
import { mongoliaOutline } from "@/content/mongolia";
import { getNetworkMapPoints } from "@/lib/dealer-network";
import { loadLeaflet, type LeafletLibrary, type MapLayerGroup, type MapMarker, type StreetMap } from "@/lib/leaflet-loader";
import type { Locale } from "@/lib/i18n";
import "../../public/vendor/leaflet/leaflet.css";

const pinShape = '<svg viewBox="0 0 40 50" aria-hidden="true"><path d="M20 1C9.5 1 1 9.5 1 20c0 13 19 29 19 29s19-16 19-29C39 9.5 30.5 1 20 1Z" fill="currentColor" stroke="white" stroke-width="1.5"/><circle cx="20" cy="19" r="10" fill="none" stroke="white" stroke-width="1.2"/><path d="m15 21 4-7 6 10" fill="none" stroke="white" stroke-width="1.5"/></svg>';

export function NetworkStreetMap({ locations, locale, selectedId, onSelect }: { locations: Location[]; locale: Locale; selectedId: string | null; onSelect: (id: Location["id"]) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<StreetMap | null>(null);
  const libraryRef = useRef<LeafletLibrary | null>(null);
  const groupRef = useRef<MapLayerGroup | null>(null);
  const markersRef = useRef(new Map<string, MapMarker>());
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const points = useMemo(() => getNetworkMapPoints(locations), [locations]);
  const selectedPoint = points.find(point => point.locationIds.some(id => id === selectedId));

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;
    let cancelled = false;
    let started = false;
    let resize: ResizeObserver | undefined;
    const markers = markersRef.current;
    const start = async () => {
      if (started) return;
      started = true;
      try {
        const L = await loadLeaflet();
        if (cancelled || !canvasRef.current) return;
        libraryRef.current = L;
        const map = L.map(canvasRef.current, { center: [48.7, 105.5], zoom: 7, scrollWheelZoom: false });
        mapRef.current = map;
        groupRef.current = L.layerGroup().addTo(map);
        const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', referrerPolicy: "strict-origin-when-cross-origin" }).addTo(map);
        tiles.on("tileerror", () => { if (!cancelled) setUnavailable(true); });
        tiles.on("tileload", () => { if (!cancelled) setUnavailable(false); });
        resize = new ResizeObserver(() => map.invalidateSize());
        resize.observe(root);
        setLoaded(true);
      } catch { if (!cancelled) setUnavailable(true); }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void start(); }
    }, { rootMargin: "160px" });
    observer.observe(root);
    return () => {
      cancelled = true;
      observer.disconnect();
      resize?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      groupRef.current = null;
      markers.clear();
    };
  }, []);

  useEffect(() => {
    const L = libraryRef.current;
    const map = mapRef.current;
    const group = groupRef.current;
    if (!loaded || !L || !map || !group) return;
    group.clearLayers();
    markersRef.current.clear();
    for (const point of points) {
      const location = locations.find(item => item.id === point.locationIds[0])!;
      const label = point.precision === "pin" ? location.name[locale] : `${point.city[locale]} · ${locale === "mn" ? "Хотын бүс" : "City area"} (${point.locationIds.length})`;
      const tooltip = document.createElement("span");
      tooltip.textContent = label;
      const icon = L.divIcon({ className: `network-pin network-pin--${point.precision === "pin" ? "exact" : "city"}`, html: point.precision === "pin" ? pinShape : `<span>${point.locationIds.length}</span>`, iconSize: [48, 56], iconAnchor: [24, point.precision === "pin" ? 50 : 28] });
      const marker = L.marker(point.coordinates, { icon, title: label, alt: label, keyboard: true }).addTo(group).bindTooltip(tooltip, { direction: "top", offset: [0, -35] }).on("click", () => onSelect(point.locationIds[0]));
      marker.getElement()?.setAttribute("aria-label", label);
      markersRef.current.set(point.id, marker);
    }
    if (points.length) map.fitBounds(points.map(point => point.coordinates), { padding: [64, 64], maxZoom: 12, animate: false });
  }, [loaded, points, locations, locale, onSelect]);

  useEffect(() => {
    if (!loaded) return;
    for (const point of points) {
      const marker = markersRef.current.get(point.id);
      const active = point.locationIds.some(id => id === selectedId);
      marker?.getElement()?.classList.toggle("is-selected", active);
      marker?.setZIndexOffset(active ? 1000 : 0);
    }
    if (selectedPoint) mapRef.current?.setView(selectedPoint.coordinates, selectedPoint.precision === "pin" ? 15 : 12, { animate: false });
  }, [loaded, points, selectedId, selectedPoint]);

  function resetView() {
    if (points.length) mapRef.current?.fitBounds(points.map(point => point.coordinates), { padding: [64, 64], maxZoom: 12, animate: false });
  }

  return <div ref={rootRef} className="network-map" data-loaded={loaded} data-selected={selectedId ?? ""} data-mobile-open={mobileOpen}>
    <button type="button" className="network-map__mobile-toggle" aria-expanded={mobileOpen} aria-controls="network-street-map" onClick={() => setMobileOpen(value => !value)}>{locale === "mn" ? mobileOpen ? "Газрын зураг хаах" : "Газрын зураг харах" : mobileOpen ? "Hide street map" : "View street map"}<span aria-hidden="true">{mobileOpen ? "−" : "+"}</span></button>
    <div className="network-map__content" id="network-street-map">
    <div className="network-map__placeholder" aria-hidden="true"><svg viewBox="0 0 1200 600"><path d={mongoliaOutline} /></svg></div>
    <div ref={canvasRef} className="network-map__canvas" role="region" aria-label={locale === "mn" ? "Салбаруудын газрын зураг" : "Map of our locations"} />
    <div className="network-map__legend"><span><i className="network-map__key network-map__key--pin" />{locale === "mn" ? "Баталгаатай пин" : "Verified pin"}</span><span><i className="network-map__key network-map__key--area" />{locale === "mn" ? "Хотын бүс" : "City area"}</span></div>
    {loaded && <button type="button" className="network-map__reset" onClick={resetView}>{locale === "mn" ? "Бүгдийг харах" : "Show all locations"}<span aria-hidden="true">↗</span></button>}
    {!loaded && !unavailable && <p className="network-map__loading">{locale === "mn" ? "Газрын зураг ачаалж байна…" : "Loading map…"}</p>}
    {selectedPoint?.precision === "city" && <p className="network-map__area-note">{locale === "mn" ? "Хотын бүсийг харуулж байна. Хаягийг «Газрын зургаас хайх» холбоосоор үзнэ үү." : "City area shown. Use Search map to find the address."}</p>}
    {unavailable && <p className="network-map__unavailable" role="status">{locale === "mn" ? "Газрын зураг ачаалсангүй. Салбарын хаяг, холбоосыг доорх жагсаалтаас үзнэ үү." : "The street map is unavailable. Addresses and map links are in the location list."}</p>}
    </div>
  </div>;
}
