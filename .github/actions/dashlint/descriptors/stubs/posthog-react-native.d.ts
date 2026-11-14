// Type stub for posthog-react-native, used by dashlint only when the package is not installed
// (spec 6.4 item 2). It keeps the public members dashlint matches, with the signatures of
// posthog-react-native 4.86.0 (dist/posthog-rn.d.ts, dist/hooks/usePostHog.d.ts,
// dist/PostHogProvider.d.ts) and @posthog/core
// 1.67.2 (dist/posthog-core.d.ts, dist/posthog-core-stateless.d.ts, dist/types.d.ts), and the same
// class chain: PostHog extends PostHogCore extends PostHogCoreStateless. Modified by dashlint:
// reduced to that surface; option types are left open.
//
// Upstream licence (posthog-react-native LICENSE):
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
// posthog-react-native's package.json and @posthog/core are MIT licensed:
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

declare module 'posthog-react-native' {
  export type JsonType =
    string | number | boolean | null | { [key: string]: JsonType } | JsonType[];
  export type PostHogEventProperties = { [key: string]: JsonType };
  export type PostHogCaptureOptions = {
    uuid?: string;
    timestamp?: Date;
    disableGeoip?: boolean;
  };
  /** An enum upstream; left open here. */
  export type PostHogPersistedProperty = string;
  export interface PostHogOptions {
    [option: string]: unknown;
  }

  export abstract class PostHogCoreStateless {
    register(properties: PostHogEventProperties): Promise<void>;
  }

  export abstract class PostHogCore extends PostHogCoreStateless {
    reset(propertiesToKeep?: PostHogPersistedProperty[]): void;
    identify(
      distinctId?: string,
      properties?: PostHogEventProperties,
      options?: PostHogCaptureOptions,
    ): void;
    capture(
      event: string,
      properties?: PostHogEventProperties,
      options?: PostHogCaptureOptions,
    ): void;
    group(
      groupType: string,
      groupKey: string | number,
      groupProperties?: PostHogEventProperties,
      options?: PostHogCaptureOptions,
    ): void;
    setPersonProperties(
      userPropertiesToSet?: { [key: string]: JsonType },
      userPropertiesToSetOnce?: { [key: string]: JsonType },
      reloadFeatureFlags?: boolean,
    ): void;
  }

  export class PostHog extends PostHogCore {
    constructor(projectToken: string, options?: PostHogOptions);
    register(properties: PostHogEventProperties): Promise<void>;
    reset(propertiesToKeep?: PostHogPersistedProperty[]): void;
    group(groupType: string, groupKey: string, properties?: PostHogEventProperties): void;
    screen(
      name: string,
      properties?: PostHogEventProperties,
      options?: PostHogCaptureOptions,
    ): Promise<void>;
    identify(
      distinctId?: string,
      properties?: PostHogEventProperties,
      options?: PostHogCaptureOptions,
    ): void;
    setPersonProperties(
      userPropertiesToSet?: { [key: string]: JsonType },
      userPropertiesToSetOnce?: { [key: string]: JsonType },
      reloadFeatureFlags?: boolean,
    ): void;
  }

  export const usePostHog: () => PostHog;
  export interface PostHogProviderProps {
    children?: unknown;
    options?: PostHogOptions;
    projectToken?: string;
    apiKey?: string;
    client?: PostHog;
    autocapture?: boolean | { [option: string]: unknown };
    debug?: boolean;
    style?: unknown;
  }
  export const PostHogProvider: (props: PostHogProviderProps) => any;
  export default PostHog;
}
