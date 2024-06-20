const newsServices = () => {
    const SELECTORS = {
        select: '.js-select-country',
        search: '.js-search',
        btn: '.js-news-btn',
        postWrap: '.js-posts-wrap',
        message: '.js-news-message',
        spinner: '.js-spinner',
    }

    const CLASSES = {
        active: 'active'
    }

    const $form  = document.forms['newsPost']
    const $select = document.querySelector(SELECTORS.select);
    const $search = document.querySelector(SELECTORS.search);
    const $btnSubmit = document.querySelector(SELECTORS.btn);    
    const $message = document.querySelector(SELECTORS.message);
    const $spinner = document.querySelector(SELECTORS.spinner);
    const $postWrap = document.querySelector(SELECTORS.postWrap);    
    
    $form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadNews();
    });

    const customHttp = () => {
        return {
            get(url, cb) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", url);

                    xhr.addEventListener('load', () => {
                        if (Math.floor(xhr.status / 100) !== 2) {
                            cb(`Error. Status code: ${xhr.status}`, xhr);
                            return;
                        }
                        const res = JSON.parse(xhr.responseText);
                        cb(null, res);
                    });

                    xhr.addEventListener('error', () => {
                        cb(`Error. Status code: ${xhr.status}`, xhr);            
                    });

                    xhr.send();
                } catch(error) {
                    cb(error);    
                } 
            },
            post(url, body, headers, cb) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", url);

                    xhr.addEventListener('load', () => {
                        if (Math.floor(xhr.status / 100) !== 2) {
                            cb(`Error. Status code: ${xhr.status}`, xhr);
                            return;
                        }
                        const res = JSON.parse(xhr.responseText);
                        cb(null, res);
                    });

                    xhr.addEventListener('error', () => {
                        cb(`Error. Status code: ${xhr.status}`, xhr);            
                    });

                    if (headers) {
                        Object.entries(headers).forEach(([key, value]) => {
                            xhr.setRequestHeader(key, value);
                        });
                    }

                    xhr.send(JSON.stringify(body));
                } catch(error) {
                    cb(error);    
                } 
            }
        };
    };     

    const http = customHttp();

    const services = (() => {
        const apiKey = '98ce7570fd67452e9a7188232f22f56d';
        const apiUrl = 'https://newsapi.org/v2';

        return {
            topHeadlines(country = 'ua', cb) {
                http.get(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`, cb );
            }, 
            everything(query, cb) {
                http.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`, cb );
            }
        }
    })();

    const showSpinner = () => {
        if (!$spinner) return;
        $spinner.classList.add(CLASSES.active);
        $postWrap.style.display = 'none';
    }

    const hideSpinner = () => {
        if (!$spinner) return;
        $spinner.classList.remove(CLASSES.active);
        $postWrap.style.display = 'grid';
    }

    const newsTemplate = (newsItem) => {
        const { title, description, publishedAt, url, urlToImage } = newsItem;

        return `
            <a href=${url || '#'} class="news_item">
                <picture class="news_item__pic">
                    <img src=${urlToImage || 'assets/test.jpg'} alt=${title} class="news_item__img">
                </picture>	
                <div class="news_item__content">
                    <h4 class="news_item__title">${title || ''}</h4>
                    <p class="news_item__text">${description || ''}</p>
                </div>
                <div class="news_item__bottom">
                    <time class="news_item__date">${publishedAt || ''}</time>
                    <div class="news_item__bottom_text">read more</div>                    
                </div>
            </a>	
        `
    } 

    const renderNews = (news) => {
          
        if (!$postWrap) return;

        if ($postWrap.children.length) {
            clearContainer($postWrap);
        }

        let fragment = '';

        news.forEach((newsItem) => {            
            const el = newsTemplate(newsItem);          
            fragment += el;
        });

        $postWrap.insertAdjacentHTML('afterbegin', fragment);
    }

    const showAlert = (msg) => {
        $message.textContent = msg;

        const $parentWrap = $message.parentElement;
        $parentWrap.classList.add('visible');

        setTimeout(() => {
            $parentWrap.classList.remove('visible');
        }, 3500);
    }
    
    const onGetResponse = (err, res) => {
        hideSpinner();

        if (err) {
            showAlert(err);
            return
        }

        if (!res.articles.length) {
            showAlert('Not contents');
            return
        }

        renderNews(res.articles);
    }

    const clearContainer = (container) => {
        container.innerHTML = '';
    }
    
    const loadNews = () => {
        showSpinner();
        const country = $select.value;        
        const searchText = $search.value;        

        if (!searchText) {
            services.topHeadlines(country, onGetResponse);
        } else {
            services.everything(searchText, onGetResponse);
        }        
    }

    loadNews();
}  

export default newsServices;