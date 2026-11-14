// Type stub for @segment/analytics-react-native, used by dashlint only when the package is not
// installed (spec 6.4 item 2). It keeps the public members dashlint matches, with the signatures
// of @segment/analytics-react-native 2.24.2 (lib/typescript/src/analytics.d.ts,
// lib/typescript/src/client.d.ts, lib/typescript/src/types.d.ts).
// Modified by dashlint: reduced to that surface, declared in one module, the ClientMethods type
// alias written as an interface and the client.d.ts consts as functions; config, context and
// event types are left open.
//
// Upstream licence (@segment/analytics-react-native LICENSE):
// MIT License. Copyright (c) 2020 Segment.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software
// and associated documentation files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions: The above copyright notice
// and this permission notice shall be included in all copies or substantial portions of the
// Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

declare module '@segment/analytics-react-native' {
  export interface JsonMap {
    [key: string]: any;
  }
  export type UserTraits = JsonMap;
  export interface SegmentEvent {
    [key: string]: any;
  }
  export type EnrichmentClosure = (event: SegmentEvent) => SegmentEvent;
  export interface Config {
    writeKey: string;
    trackAppLifecycleEvents?: boolean;
    trackDeepLinks?: boolean;
    [key: string]: any;
  }

  export class SegmentClient {
    // Declared so screen calls resolve; no descriptor entry matches them (ADR-056).
    screen(name: string, options?: JsonMap, enrichment?: EnrichmentClosure): Promise<void>;
    track(eventName: string, options?: JsonMap, enrichment?: EnrichmentClosure): Promise<void>;
    identify(
      userId?: string,
      userTraits?: UserTraits,
      enrichment?: EnrichmentClosure,
    ): Promise<void>;
    reset(resetAnonymousId?: boolean): Promise<void>;
  }

  export interface ClientMethods {
    screen: (name: string, properties?: JsonMap, enrichment?: EnrichmentClosure) => Promise<void>;
    track: (event: string, properties?: JsonMap, enrichment?: EnrichmentClosure) => Promise<void>;
    identify: (
      userId?: string,
      userTraits?: UserTraits,
      enrichment?: EnrichmentClosure,
    ) => Promise<void>;
    reset: (resetAnonymousId?: boolean) => Promise<void>;
  }

  export function createClient(config: Config): SegmentClient;
  export function AnalyticsProvider(props: { client?: SegmentClient; children?: any }): any;
  export function useAnalytics(): ClientMethods;
}
