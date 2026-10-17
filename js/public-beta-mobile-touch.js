/* Prevent browser text selection and long-press context menus on gamepad only.
   Existing pointerdown/up/cancel movement handlers remain unchanged. */
(()=>{
  'use strict';
  function onGameControl(target) {
    return target instanceof Element && !!target.closest('#controls, #action');
  }
  for (const type of ['contextmenu', 'selectstart', 'dragstart']) {
    document.addEventListener(type, event => {
      if (onGameControl(event.target)) event.preventDefault();
    }, true);
  }
})();
