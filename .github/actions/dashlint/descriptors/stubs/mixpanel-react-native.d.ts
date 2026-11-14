// Type stub for mixpanel-react-native, used by dashlint only when the package is not installed
// (spec 6.4 item 2). It keeps the public members dashlint matches, with the signatures of
// mixpanel-react-native 4.1.0 (index.d.ts): the Mixpanel class and the People class its
// getPeople() returns. Modified by dashlint: reduced to that surface.
//
// Upstream licence (mixpanel-react-native LICENSE.md):
// Copyright 2022 Mixpanel, Inc.
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except
// in compliance with the License. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing permissions and
// limitations under the License.

declare module 'mixpanel-react-native' {
  type MixpanelType = any;
  type MixpanelProperties = { [key: string]: MixpanelType };

  export class Mixpanel {
    constructor(token: string, trackAutoMaticEvents: boolean);
    constructor(token: string, trackAutoMaticEvents: boolean, useNative: true);
    constructor(token: string, trackAutomaticEvents: boolean, useNative: false, storage?: any);
    static init(
      token: string,
      trackAutomaticEvents: boolean,
      optOutTrackingDefault?: boolean,
    ): Promise<Mixpanel>;
    init(
      optOutTrackingDefault?: boolean,
      superProperties?: MixpanelProperties,
      serverURL?: string,
      useGzipCompression?: boolean,
      featureFlagsOptions?: any,
      autocaptureOptions?: any,
    ): Promise<void>;
    identify(distinctId: string): Promise<void>;
    track(eventName: string, properties?: MixpanelProperties): void;
    getPeople(): People;
    trackWithGroups(
      eventName: string,
      properties?: MixpanelProperties,
      groups?: MixpanelProperties,
    ): void;
    registerSuperProperties(properties: MixpanelProperties): void;
    registerSuperPropertiesOnce(properties: MixpanelProperties): void;
    reset(): void;
  }

  export class People {
    constructor(token: string, mixpanelInstance: any);
    set(prop: string, to: MixpanelType): void;
    set(properties: MixpanelProperties): void;
    setOnce(prop: string, to: MixpanelType): void;
    setOnce(properties: MixpanelProperties): void;
  }
}
