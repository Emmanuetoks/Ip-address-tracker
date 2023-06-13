/// <reference types="vite/client" />

export interface ipifyRequestOptions extends RequestInit{
    method:string,
    apiKey: string,
    ipAddress ?: string;
    domain?: string
}