// Type stub for mixpanel-browser, used by dashlint only when the package is not installed (spec 6.4
// item 2). It keeps the public members dashlint matches, with the signatures of mixpanel-browser
// 2.85.0 (src/index.d.ts): the Mixpanel interface, the default export's OverridedMixpanel, the
// People interface and the module-level functions that mirror the instance. Modified by dashlint:
// reduced to that surface; option types are left open.
//
// Upstream licence (mixpanel-browser LICENSE):
// Copyright 2015 Mixpanel, Inc.
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except
// in compliance with the License. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing permissions and
// limitations under the License.

declare module 'mixpanel-browser' {
  export interface Dict {
    [key: string]: any;
  }
  export interface RequestOptions {
    [key: string]: any;
  }
  export interface RegisterOptions {
    [key: string]: any;
  }
  export interface Config {
    [key: string]: any;
  }
  export type Query = string | Element | Element[];
  export type Callback = (response: any) => void;

  export interface People {
    set(prop: string, to: any, callback?: Callback): void;
    set(prop: Dict, callback?: Callback): void;
    set_once(prop: string, to: any, callback?: Callback): void;
    set_once(prop: Dict, callback?: Callback): void;
  }

  export interface Mixpanel {
    identify(unique_id?: string): any;
    init(token: string, config: Partial<Config>, name?: string): Mixpanel;
    register(props: Dict, days_or_options?: number | Partial<RegisterOptions>): void;
    register_once(
      props: Dict,
      default_value?: any,
      days_or_options?: number | Partial<RegisterOptions>,
    ): void;
    reset(): void;
    track(
      event_name: string,
      properties?: Dict,
      optionsOrCallback?: RequestOptions | Callback,
      callback?: Callback,
    ): void;
    track_forms(query: Query, event_name: string, properties?: Dict | (() => void)): void;
    track_links(query: Query, event_name: string, properties?: Dict | (() => void)): void;
    track_pageview(properties?: Dict, options?: { event_name?: string | undefined }): void;
    track_with_groups(
      event_name: string,
      properties: Dict,
      groups: Dict,
      callback?: Callback,
    ): void;
    people: People;
  }

  export interface OverridedMixpanel extends Mixpanel {
    init(token: string, config: Partial<Config>, name: string): Mixpanel;
    init(token: string, config?: Partial<Config>): undefined;
  }

  export function identify(unique_id?: string): any;
  export function init(token: string, config: Partial<Config>, name: string): Mixpanel;
  export function init(token: string, config?: Partial<Config>): undefined;
  export function register(props: Dict, days_or_options?: number | Partial<RegisterOptions>): void;
  export function register_once(
    props: Dict,
    default_value?: any,
    days_or_options?: number | Partial<RegisterOptions>,
  ): void;
  export function reset(): void;
  export function track(
    event_name: string,
    properties?: Dict,
    optionsOrCallback?: RequestOptions | Callback,
    callback?: Callback,
  ): void;
  export function track_forms(
    query: Query,
    event_name: string,
    properties?: Dict | (() => void),
  ): void;
  export function track_links(
    query: Query,
    event_name: string,
    properties?: Dict | (() => void),
  ): void;
  export function track_with_groups(
    event_name: string,
    properties: Dict,
    groups: Dict,
    callback?: Callback,
  ): void;
  export const people: People;

  const mixpanel: OverridedMixpanel;
  export default mixpanel;
}
