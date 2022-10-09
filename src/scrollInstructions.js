/*
 * OpenSeadragon - ScrollInstructions
 *
 * Copyright (C) 2009 CodePlex Foundation
 * Copyright (C) 2010-2022 OpenSeadragon contributors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * - Neither the name of CodePlex Foundation nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function( $ ){

/**
 * @class ScrollInstructions
 * @classdesc Instructions displayed when trapScroll is set to false and
 * event passes through to parent container / document
 *
 * @memberof OpenSeadragon
 * @param {Object} options ScrollInstructions options.
 */
$.ScrollInstructions = function( options ) {

    this.options = $.extend(true, options, {
        wheelText: 'Use ' + this.getScrollModifierKey() + ' + scroll to zoom',
        touchText: 'Use two fingers to pan',
    });

    this.viewer = this.options.viewer;
    this.showTimeout = null;
    this.fadeBeginTime = null;

    if (this.viewer) {
        this.element = insert(this.viewer.container);
    }

};

/** @lends OpenSeadragon.ScrollInstructions.prototype */
$.ScrollInstructions.prototype = {
    /**
     * Update wording of instructions, usually in response to a gesture
     * @function
     * @param {('touch'|'wheel')} type Type of insruction text to display
     */
    updateText: function(type) {
        // TODO: What about 'pen' / 'unknown' ?
        var text = type === 'touch' ? this.options.touchText : this.options.wheelText;
        if (this.element.innerText !== text) {
            this.element.innerText = text;
        }
    },
    /**
     * Detetmine what the modifier key should be for scroll based on system platform
     * @function
     * @return {String} String for the key needed to scroll
     */
    getScrollModifierKey: function() {
        var platform = navigator.userAgentData.platform ? navigator.userAgentData.platform : navigator.platform;
        // Mac users will need to use cmd, other platforms are ctrl
        if (isMacLike(platform)) {
            return 'cmd';
        } else {
            return 'ctrl';
        }
    },
    /**
     * Show the instructions element and set a timer for hiding
     * @function
     */
    show: function() {
        var _this = this;
        this.element.style.opacity = 1;

        // Cancel the timeout if called again
        clearTimeout(this.showTimeout);
        this.showTimeout = null;

        // Wait before hiding
        this.showTimeout = setTimeout(function() {
            _this.element.style.opacity = 0;
        }, 2000);
    }
};


/**
 * Tests a string for Mac-like identifiers
 * @private
 * @inner
 * @function
 * @param {String} platform String to test
 * @return {Boolean} If tested string is Mac-Like
 */
function isMacLike(platform) {
    return ['Mac', 'iPhone', 'iPad'].some(function(item) {
        return platform.includes(item);
    });
}


/**
 * Create and insert HTML for instruction text to be inserted into
 * @private
 * @inner
 * @function
 * @param {HTMLElement} container - The element to insert the instructions into
 * @return {HTMLDivElement} The HTML element for inserted the instructions
 */
function insert(container) {
    var instructionsEl = document.createElement('div');
    instructionsEl.classList.add('openseadragon-scroll-instructions');
    Object.assign(instructionsEl.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        background: 'rgba(0,0,0,0.5)',
        opacity: '0',
        touchAction: 'none',
        pointerEvents: 'none',
        transition: 'opacity 1s',
    });
    container.insertAdjacentElement('beforeend', instructionsEl);
    return container.lastElementChild;
}

}( OpenSeadragon ));
