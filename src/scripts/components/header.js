import { onWindowScroll, exist } from '../utils';

const header = () => {
    const SELECTORS = {        
        menuTrigger: '.js-header-menu-trigger',
    };

    const CLASSNAMES = {
        bodyOpenMenuState: 'body--open_menu_state',
        headerScrollState: 'header--scroll_state',
        bodyScrollPos: 'header--pos_state',
    };

    const $body = document.body;
    const $header = document.querySelector('header');
    if (!$header) return;
    const $menuTrigger = $header.querySelector(SELECTORS.menuTrigger);

    let isMenuOpen = false;
    let prevScrollPos = window.scrollY;
	const headerHeight = $header.clientHeight;

    const handleTriggerClick = () => {
        if (!isMenuOpen) {
            $body.classList.add(CLASSNAMES.bodyOpenMenuState);
            isMenuOpen = true;
        } else {
            $body.classList.remove(CLASSNAMES.bodyOpenMenuState);
            isMenuOpen = false;
        }
    };

    const headerScroll = (windowScrollTop) => {
        if (windowScrollTop > 10 && !$header.classList.contains(CLASSNAMES.headerScrollState)) {
            $header.classList.add(CLASSNAMES.headerScrollState);
        } else if (windowScrollTop <= 10 && $header.classList.contains(CLASSNAMES.headerScrollState)) {
            $header.classList.remove(CLASSNAMES.headerScrollState);
        }

        if (prevScrollPos < window.scrollY && scrollY > headerHeight) {
			$header.classList.add(CLASSNAMES.bodyScrollPos);
		} else {
			$header.classList.remove(CLASSNAMES.bodyScrollPos);
		}
		prevScrollPos = window.scrollY;
    };

    onWindowScroll(headerScroll);

    if (!$menuTrigger) return;
    $menuTrigger.addEventListener('click', () => {
        handleTriggerClick();
    });
};

export default header;
