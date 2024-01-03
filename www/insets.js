'use strict';

/*
   Copyright 2022 Total Pave Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
const SERVICE_NAME = "Insets";
class InsetsAPI {
    constructor() {
        this.listeners = [];
        this.insets = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
    async setMask(mask) {
        if (cordova.platformId === 'ios') {
            return this.insets;
        }
        return new Promise((resolve, reject) => {
            let self = this;
            cordova.exec((insets) => {
                self.insets = insets;
                resolve(insets);
            }, reject, SERVICE_NAME, "setMask", [mask]);
        });
    }
    /**
     * Initializes javascript side of the plugin.
     *
     * This function is called automatically on deviceready.
     * @internal
     */
    __init() {
        if (this.initPromise) {
            return this.initPromise;
        }
        this.initPromise = new Promise((resolve, reject) => {
            // no-op on iOS, still installs to iOS so apps don't need to do platform checks.
            if (cordova.platformId === 'ios') {
                resolve();
                return;
            }
            // Setup promise resolving mechanism.
            // We don't use the cordova callback functions as they will be called multiple times over the lifespan of an app.
            let func = () => {
                resolve();
                this.removeListener(func);
            };
            this.addListener(func);
            // Setup cordova callback.
            let that = this;
            cordova.exec((insets) => {
                that.insets = insets;
                for (let i = 0, listeners = that.listeners.slice(), length = listeners.length; i < length; ++i) {
                    listeners[i](insets);
                }
            }, reject, SERVICE_NAME, "setListener", []);
        });
    }
    addListener(callback) {
        this.listeners.push(callback);
    }
    removeListener(callback) {
        let index = this.listeners.indexOf(callback);
        if (index === -1) {
            return;
        }
        this.listeners.splice(index, 1);
    }
    /**
     * @returns Last emitted insets.
     */
    getInsets() {
        return this.insets;
    }
}
const Insets = new InsetsAPI();
document.addEventListener('deviceready', function () {
    Insets.__init();
});

/*
   Copyright 2022 Total Pave Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
/**
 * An enumeration of Inset Types.
 * These are mapped to android's native WindowInsetsCompat.TYPE
 *
 * See https://developer.android.com/reference/androidx/core/view/WindowInsetsCompat.Type
 * for more information.
 *
 * Note that the native constant values is an implementation detail,
 * therefore the values here isn't a direct mapping, but will be resolved
 * appropriately.
 */
exports.InsetType = void 0;
(function (InsetType) {
    InsetType[InsetType["CAPTION_BAR"] = 1] = "CAPTION_BAR";
    InsetType[InsetType["DISPLAY_CUTOUT"] = 2] = "DISPLAY_CUTOUT";
    InsetType[InsetType["IME"] = 4] = "IME";
    InsetType[InsetType["MANDATORY_SYSTEM_GESTURES"] = 8] = "MANDATORY_SYSTEM_GESTURES";
    InsetType[InsetType["NAVIGATION_BARS"] = 16] = "NAVIGATION_BARS";
    InsetType[InsetType["STATUS_BARS"] = 32] = "STATUS_BARS";
    InsetType[InsetType["SYSTEM_BARS"] = 64] = "SYSTEM_BARS";
    InsetType[InsetType["SYSTEM_GESTURES"] = 128] = "SYSTEM_GESTURES";
    InsetType[InsetType["TAPPABLE_ELEMENT"] = 256] = "TAPPABLE_ELEMENT";
})(exports.InsetType || (exports.InsetType = {}));

exports.Insets = Insets;
//# sourceMappingURL=insets.js.map
