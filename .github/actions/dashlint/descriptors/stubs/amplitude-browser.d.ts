// Type stub for @amplitude/analytics-browser, used by dashlint only when the package is not
// installed (spec 6.4 item 2). It keeps the public members dashlint matches, with the signatures
// of @amplitude/analytics-browser 2.49.2 (lib/esm/index.d.ts, lib/esm/browser-client-lite.d.ts)
// and @amplitude/analytics-core 2.62.1 (lib/esm/types/client/core-client.d.ts,
// lib/esm/types/client/browser-client.d.ts, lib/esm/core-client.d.ts, lib/esm/identify.d.ts,
// lib/esm/types/event/base-event.d.ts). Modified by dashlint: reduced to that surface, declared in
// one module, the default instance's consts written as functions; option types are left open.
//
// Upstream licence (@amplitude/analytics-browser and @amplitude/analytics-core LICENSE):
// MIT License. Copyright (c) 2022 Amplitude Analytics.
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

declare module '@amplitude/analytics-browser' {
  export interface AmplitudeReturn<T> {
    promise: Promise<T>;
  }
  export interface Result {
    [key: string]: any;
  }
  export interface EventOptions {
    [key: string]: any;
  }
  export interface BrowserOptions {
    [key: string]: any;
  }
  export interface BaseEvent extends EventOptions {
    event_type: string;
    event_properties?: { [key: string]: any };
  }

  export interface IIdentify {
    set(property: string, value: any): IIdentify;
    setOnce(property: string, value: any): IIdentify;
  }
  export class Identify implements IIdentify {
    set(property: string, value: any): Identify;
    setOnce(property: string, value: any): Identify;
  }

  export interface CoreClient {
    track(
      eventInput: BaseEvent | string,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result>;
    logEvent(
      eventInput: BaseEvent | string,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result>;
    identify(identify: IIdentify, eventOptions?: EventOptions): AmplitudeReturn<Result>;
  }
  export interface Client extends CoreClient {
    setUserId(userId: string | undefined): void;
    reset(): void;
  }
  export interface BrowserClient extends Client {
    init(apiKey: string, options?: BrowserOptions): AmplitudeReturn<void>;
    init(apiKey: string, userId?: string, options?: BrowserOptions): AmplitudeReturn<void>;
  }

  export class AmplitudeCore {
    track(
      eventInput: BaseEvent | string,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result>;
    logEvent: (
      eventInput: BaseEvent | string,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ) => AmplitudeReturn<Result>;
    identify(identify: IIdentify, eventOptions?: EventOptions): AmplitudeReturn<Result>;
  }
  export class AmplitudeBrowserLite extends AmplitudeCore implements BrowserClient {
    init(
      apiKey?: string,
      userIdOrOptions?: string | BrowserOptions,
      maybeOptions?: BrowserOptions,
    ): AmplitudeReturn<void>;
    setUserId(userId: string | undefined): void;
    reset(): void;
    identify(identify: IIdentify, eventOptions?: EventOptions): AmplitudeReturn<Result>;
  }
  export class AmplitudeBrowser extends AmplitudeBrowserLite {}

  export function createInstance(): BrowserClient;
  export function init(apiKey: string, options?: BrowserOptions): AmplitudeReturn<void>;
  export function init(
    apiKey: string,
    userId?: string,
    options?: BrowserOptions,
  ): AmplitudeReturn<void>;
  export function track(
    eventInput: BaseEvent | string,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions,
  ): AmplitudeReturn<Result>;
  export function logEvent(
    eventInput: BaseEvent | string,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions,
  ): AmplitudeReturn<Result>;
  export function identify(
    identify: IIdentify,
    eventOptions?: EventOptions,
  ): AmplitudeReturn<Result>;
  export function setUserId(userId: string | undefined): void;
  export function reset(): void;
}
