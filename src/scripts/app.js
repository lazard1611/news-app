import gsap from 'gsap';
import '../index.html';
import '../styles/app.scss';
import { pageLoad } from './utils';
import header from './components/header';
import newsServices from './components/news-services';

pageLoad(() => {
    header();
    newsServices(); 
});
