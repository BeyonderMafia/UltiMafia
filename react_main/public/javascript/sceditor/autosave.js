/* SCEditor v2.1.3 | (C) 2017, Sam Clarke | sceditor.com/license */

!(function (e) {
  "use strict";
  var t = "sce-autodraft-" + location.pathname + location.search;
  function i(e) {
    localStorage.removeItem(e || t);
  }
  (e.plugins.autosave = function () {
    var a,
      e = this,
      o = t,
      r = 864e5,
      n = function (e) {
        localStorage.setItem(o, JSON.stringify(e));
      },
      s = function () {
        return JSON.parse(localStorage.getItem(o));
      };
    (e.init = function () {
      var e = ((a = this).opts && a.opts.autosave) || {};
      (n = e.save || n),
        (s = e.load || s),
        (o = e.storageKey || o),
        (r = e.expires || r),
        (function () {
          for (var e = 0; e < localStorage.length; e++) {
            var t = localStorage.key(e);
            if (/^sce\-autodraft\-/.test(t)) {
              var a = JSON.parse(localStorage.getItem(o));
              a && a.time < Date.now() - r && i(t);
            }
          }
        })();
    }),
      (e.signalReady = function () {
        for (var e = a.getContentAreaContainer(); e; ) {
          if (/form/i.test(e.nodeName)) {
            e.addEventListener("submit", i.bind(null, o), !0);
            break;
          }
          e = e.parentNode;
        }
        var t = s();
        t &&
          (a.sourceMode(t.sourceMode),
          a.val(t.value, !1),
          a.focus(),
          t.sourceMode
            ? a.sourceEditorCaret(t.caret)
            : a.getRangeHelper().restoreRange()),
          n({
            caret: this.sourceEditorCaret(),
            sourceMode: this.sourceMode(),
            value: a.val(null, !1),
            time: Date.now(),
          });
      }),
      (e.signalValuechangedEvent = function (e) {
        n({
          caret: this.sourceEditorCaret(),
          sourceMode: this.sourceMode(),
          value: e.detail.rawValue,
          time: Date.now(),
        });
      });
  }),
    (e.plugins.autosave.clear = i);
})(sceditor);
