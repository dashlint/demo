// Type stub for @amplitude/analytics-react-native, used by dashlint only when the package is not
// installed (spec 6.4 item 2). It keeps the public members dashlint matches, with the signatures
// of @amplitude/analytics-react-native 1.13.1 (lib/typescript/index.d.ts,
// lib/typescript/react-native-client.d.ts) and @amplitude/analytics-core 2.62.1
// (lib/esm/types/client/core-client.d.ts, lib/esm/types/client/react-native-client.d.ts,
// lib/esm/core-client.d.ts, lib/esm/identify.d.ts, lib/esm/types/event/base-event.d.ts).
// Modified by dashlint: reduced to that surface, declared in one module, the default instance's
// consts written as functions; option and navigation types are left open.
//
// Upstream licence (@amplitude/analytics-react-native and @amplitude/analytics-core LICENSE):
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

declare module '@amplitude/analytics-react-native' {
  export interface AmplitudeReturn<T> {
    promise: Promise<T>;
  }
  export interface Result {
    [key: string]: any;
  }
  export interface EventOptions {
    [key: string]: any;
  }
  export interface ReactNativeOptions {
    [key: string]: any;
  }
  export interface NavigationState {
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
  export interface ReactNativeClient extends Client {
    init(apiKey: string, userId?: string, options?: ReactNativeOptions): AmplitudeReturn<void>;
    trackScreenView(
      screenName: string,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result | undefined>;
    trackScreenViewOnNavigationStateChange(
      navigationState: NavigationState | undefined,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result | undefined>;
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
  export class AmplitudeReactNative extends AmplitudeCore implements ReactNativeClient {
    init(apiKey?: string, userId?: string, options?: ReactNativeOptions): AmplitudeReturn<void>;
    setUserId(userId: string | undefined): void;
    identify(identify: IIdentify, eventOptions?: EventOptions): AmplitudeReturn<Result>;
    reset(): void;
    trackScreenView(
      screenName: string,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result | undefined>;
    trackScreenViewOnNavigationStateChange(
      navigationState: NavigationState | undefined,
      eventProperties?: Record<string, any>,
      eventOptions?: EventOptions,
    ): AmplitudeReturn<Result | undefined>;
  }

  export function createInstance(): ReactNativeClient;
  export function init(
    apiKey: string,
    userId?: string,
    options?: ReactNativeOptions,
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
  export function trackScreenView(
    screenName: string,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions,
  ): AmplitudeReturn<Result | undefined>;
  export function trackScreenViewOnNavigationStateChange(
    navigationState: NavigationState | undefined,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions,
  ): AmplitudeReturn<Result | undefined>;
  export function identify(
    identify: IIdentify,
    eventOptions?: EventOptions,
  ): AmplitudeReturn<Result>;
  export function setUserId(userId: string | undefined): void;
  export function reset(): void;
}
