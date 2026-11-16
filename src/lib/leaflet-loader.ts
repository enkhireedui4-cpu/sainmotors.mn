import type { Coordinates } from "./dealer-network";

export interface StreetMap {
  setView(center: Coordinates, zoom: number, options?: { animate?: boolean }): this;
  fitBounds(points: Coordinates[], options?: { padding?: [number, number]; maxZoom?: number; animate?: boolean }): this;
  invalidateSize(): this;
  remove(): void;
}

export interface MapLayerGroup {
  addTo(map: StreetMap): this;
  clearLayers(): this;
}

export interface MapMarker {
  addTo(target: StreetMap | MapLayerGroup): this;
  on(event: string, callback: () => void): this;
  bindTooltip(content: HTMLElement, options?: { direction?: string; offset?: [number, number] }): this;
  getElement(): HTMLElement | undefined;
  setZIndexOffset(offset: number): this;
}

export interface LeafletLibrary {
  map(node: HTMLElement, options: Record<string, unknown>): StreetMap;
  tileLayer(url: string, options: Record<string, unknown>): {
    addTo(map: StreetMap): { on(event: string, callback: () => void): unknown };
  };
  layerGroup(): MapLayerGroup;
  divIcon(options: Record<string, unknown>): unknown;
  marker(coordinates: Coordinates, options: Record<string, unknown>): MapMarker;
}

declare global {
  interface Window { L?: LeafletLibrary }
}

let pending: Promise<LeafletLibrary> | null = null;

/** The vendored runtime is requested only when the directory map approaches view. */
export function loadLeaflet(): Promise<LeafletLibrary> {
  if (window.L) return Promise.resolve(window.L);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/vendor/leaflet/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else { pending = null; script.remove(); reject(new Error("Map runtime unavailable")); }
    };
    script.onerror = () => { pending = null; script.remove(); reject(new Error("Map runtime unavailable")); };
    document.head.append(script);
  });
  return pending;
}
