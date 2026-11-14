// Type stub for @segment/analytics-next, used by dashlint only when the package is not installed
// (spec 6.4 item 2). It keeps the public members dashlint matches, with the signatures of
// @segment/analytics-next 1.84.3 (dist/types/core/analytics/index.d.ts,
// dist/types/core/analytics/interfaces.d.ts, dist/types/core/buffer/index.d.ts,
// dist/types/browser/index.d.ts, dist/types/core/auto-track.d.ts).
// Modified by dashlint: reduced to that surface, declared in one module, the rest-tuple
// parameters written out from the argument resolvers; settings, options and context types are
// left open.
//
// Upstream licence (@segment/analytics-next LICENSE.MD):
// The MIT License (MIT). Copyright (c) 2021 Segment.
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

declare module '@segment/analytics-next' {
  export type EventProperties = Record<string, any>;
  export type UserTraits = Record<string, any>;
  export interface Options {
    [key: string]: any;
  }
  export interface AnalyticsBrowserSettings {
    writeKey: string;
    [key: string]: any;
  }
  export interface InitOptions {
    [key: string]: any;
  }
  export interface Context {
    [key: string]: any;
  }
  export type Callback = (ctx: Context) => Promise<unknown> | unknown;
  export type ID = string | null | undefined;
  export interface SegmentEvent {
    type: 'track' | 'page' | 'identify' | 'group' | 'alias' | 'screen';
    event?: string;
    properties?: EventProperties;
    [key: string]: any;
  }
  export type LinkTarget = Element | Element[] | null;
  export type FormTarget = HTMLFormElement | HTMLFormElement[] | null;

  export interface AnalyticsCore {
    track(
      eventName: string | SegmentEvent,
      properties?: EventProperties | Callback,
      options?: Options | Callback,
      callback?: Callback,
    ): Promise<Context>;
    identify(
      id?: object | ID,
      traits?: UserTraits | Callback | null,
      options?: Options | Callback,
      callback?: Callback,
    ): Promise<Context>;
  }

  export class Analytics implements AnalyticsCore {
    track(
      eventName: string | SegmentEvent,
      properties?: EventProperties | Callback,
      options?: Options | Callback,
      callback?: Callback,
    ): Promise<Context>;
    trackClick(
      links: LinkTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ): Promise<Analytics>;
    trackLink(
      links: LinkTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ): Promise<Analytics>;
    trackSubmit(
      forms: FormTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ): Promise<Analytics>;
    trackForm(
      forms: FormTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ): Promise<Analytics>;
    identify(
      id?: object | ID,
      traits?: UserTraits | Callback | null,
      options?: Options | Callback,
      callback?: Callback,
    ): Promise<Context>;
    reset(): void;
  }

  export class AnalyticsBuffered {
    trackClick: (
      links: LinkTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ) => Promise<Analytics>;
    trackLink: (
      links: LinkTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ) => Promise<Analytics>;
    trackSubmit: (
      forms: FormTarget,
      event: string | Function,
      properties?: EventProperties | Function,
      options?: Options,
    ) => Promise<Analytics>;
    identify: (
      id?: object | ID,
      traits?: UserTraits | Callback | null,
      options?: Options | Callback,
      callback?: Callback,
    ) => Promise<Context>;
    reset: () => Promise<void>;
    // Declared so page and screen calls resolve; no descriptor entry matches them (ADR-056).
    page: (
      category?: string | object | null,
      name?: string | object | Callback | null,
      properties?: Options | EventProperties | Callback | null,
      options?: Options | Callback,
      callback?: Callback,
    ) => Promise<Context>;
    screen: (
      category?: string | object | null,
      name?: string | object | Callback | null,
      properties?: Options | EventProperties | Callback | null,
      options?: Options | Callback,
      callback?: Callback,
    ) => Promise<Context>;
    track: (
      eventName: string | SegmentEvent,
      properties?: EventProperties | Callback,
      options?: Options | Callback,
      callback?: Callback,
    ) => Promise<Context>;
  }

  export class AnalyticsBrowser extends AnalyticsBuffered {
    static load(settings: AnalyticsBrowserSettings, options?: InitOptions): AnalyticsBrowser;
    load(settings: AnalyticsBrowserSettings, options?: InitOptions): AnalyticsBrowser;
  }
}
