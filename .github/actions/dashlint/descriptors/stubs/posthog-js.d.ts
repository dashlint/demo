// Type stub for posthog-js, used by dashlint only when the package is not installed (spec 6.4 item
// 2). It keeps the public members dashlint matches, with the signatures of posthog-js 1.447.15
// (dist/module.d.ts, react/dist/types/index.d.ts) and @posthog/types 1.424.1 (dist/posthog.d.ts,
// dist/capture.d.ts, dist/common.d.ts, dist/request.d.ts). Modified by dashlint: reduced to that
// surface; option and result types are left open.
//
// Upstream licence (posthog-js LICENSE):
// Copyright 2020 Posthog / Hiberly, Inc.
// Copyright 2015 Mixpanel, Inc.
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except
// in compliance with the License. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing permissions and
// limitations under the License.
//
// @posthog/types is MIT licensed:
// MIT License. Copyright (c) 2022 PostHog (part of Hiberly Inc)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
// associated documentation files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions: The above copyright notice and this
// permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

declare module 'posthog-js' {
  export type Property = any;
  export type Properties = Record<string, Property>;
  export type KnownEventName =
    | '$heatmaps_data'
    | '$opt_in'
    | '$exception'
    | '$$heatmap'
    | '$web_vitals'
    | '$dead_click'
    | '$dead_swipe'
    | '$autocapture'
    | '$copy_autocapture'
    | '$rageclick';
  export type KnownUnsafeEditableEvent =
    | '$set'
    | '$pageview'
    | '$pageleave'
    | '$identify'
    | '$groupidentify'
    | '$create_alias'
    | '$feature_flag_called';
  export type EventName = KnownUnsafeEditableEvent | KnownEventName | (string & {});
  export interface CaptureOptions {
    [option: string]: unknown;
  }
  export interface CaptureResult {
    [field: string]: unknown;
  }
  export interface RequestResponse {
    [field: string]: unknown;
  }
  export type RequestCallback = (response: RequestResponse) => void;
  export interface ResetOptions {
    [option: string]: unknown;
  }
  export interface PostHogConfig {
    [option: string]: unknown;
  }

  export class PostHog {
    init(token: string, config?: Partial<PostHogConfig>, name?: string): PostHog;
    capture(
      event_name: EventName,
      properties?: Properties | null,
      options?: CaptureOptions,
    ): CaptureResult | undefined;
    register(properties: Properties, days?: number): void;
    register_once(properties: Properties, default_value?: Property, days?: number): void;
    identify(
      new_distinct_id: string,
      userPropertiesToSet?: Properties,
      userPropertiesToSetOnce?: Properties,
    ): void;
    setPersonProperties(
      userPropertiesToSet?: Properties,
      userPropertiesToSetOnce?: Properties,
    ): void;
    group(groupType: string, groupKey: string, groupPropertiesToSet?: Properties): void;
    reset(options?: boolean | ResetOptions): void;
    /** Deprecated upstream in favour of setPersonProperties. */
    people: {
      set: (prop: string | Properties, to?: string, callback?: RequestCallback) => void;
      set_once: (prop: string | Properties, to?: string, callback?: RequestCallback) => void;
    };
  }

  const posthog: PostHog;
  export { posthog };
  export default posthog;
}

declare module 'posthog-js/react' {
  import type { PostHog, PostHogConfig } from 'posthog-js';
  export const usePostHog: () => PostHog;
  export type PostHogProviderProps =
    | { client: PostHog; apiKey?: never; options?: never; children?: unknown }
    | { apiKey: string; options?: Partial<PostHogConfig>; client?: never; children?: unknown };
  export function PostHogProvider(props: PostHogProviderProps): any;
}
