const newsServices = () => {
    const SELECTORS = {
        select: '.js-select-country',
        search: '.js-search',
        btn: '.js-news-btn',
        postWrap: '.js-posts-wrap',
    }

    const $select = document.querySelector(SELECTORS.select);
    const $search = document.querySelector(SELECTORS.search);
    const $btnSubmit = document.querySelector(SELECTORS.btn);      

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
                <time class="news_item__date">${publishedAt || ''}</time>
            </a>	
        `
    } 

    const renderNews = (news) => {
        const $postWrap = document.querySelector(SELECTORS.postWrap);  
        if (!$postWrap) return;
        let fragment = '';

        news.forEach((newsItem) => {            
            const el = newsTemplate(newsItem);          
            fragment += el;
        });

        $postWrap.insertAdjacentHTML('afterbegin', fragment);
    }
    
    const onGetResponse = (err, res) => {
        console.log(res);
        renderNews(res.articles);
    }
    
    const loadNews = () => {
        services.topHeadlines('ua', onGetResponse);
    }

    loadNews();
}  

export default newsServices;