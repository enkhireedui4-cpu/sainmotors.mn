import {validateFeedback,type FeedbackInput} from "../../supabase/functions/_shared/feedback-validation.ts";
export {validateFeedback};
export type {FeedbackInput};
const endpoint=process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT??"https://uzffaelpmhwffcuiqgjq.supabase.co/functions/v1/submit-feedback";

export async function submitFeedback(input:FeedbackInput,options:{endpoint?:string;fetcher?:typeof fetch}={}):Promise<{id:string}>{
 const validated=validateFeedback(input);
 if(!validated.ok)throw new Error("Unable to submit feedback.");
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15_000);
 try{
  const response=await(options.fetcher??fetch)(options.endpoint??endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(validated.data),credentials:"omit",cache:"no-store",redirect:"error",signal:controller.signal});
  if(!response.ok)throw new Error("Request failed");
  const body:unknown=await response.json();const id=body&&typeof body==="object"&&"id"in body?body.id:undefined;
  if(typeof id!=="string"||!id.trim()||id.length>128)throw new Error("Missing acknowledgement");
  return{id:id.trim()};
 }catch{throw new Error("Unable to submit feedback.");}finally{clearTimeout(timeout);}
}
