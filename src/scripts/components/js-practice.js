
const practice = () => {       
    
    const createPost = (body, cb) => {
        const xhr = new XMLHttpRequest();
        xhr.open("post", "https://jsonplaceholder.typicode.com/posts");
        xhr.addEventListener("load", () => {            
            const response = JSON.parse(xhr.responseText);
            cb(response);
        })

        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    
        xhr.send(JSON.stringify(body));
    }

    const myHttpRequest = ({method, url} = {}, cb) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.addEventListener("load", () => {            
            const response = JSON.parse(xhr.responseText);
            if (Math.floor(xhr.status / 100) != 2) {
                cb(`Error status code: ${xhr.status}`, xhr);
            }
            cb(null, response);
        })
    
        xhr.send();
    }

    

    const $postsWrap = document.querySelector('.js-posts-wrap');
    const $btnGet = document.querySelector('.js-post-get-btn');
    const $btnPost = document.querySelector('.js-post-add-btn');

    $btnGet.addEventListener('click', () => {   
        
        myHttpRequest({
            method: 'get',
            url: 'https://jsonplaceholder.typicode.com/posts'
        },
        res => {
            res.forEach((element) => {
                console.log('element', element);
                const post = document.createElement('div');
                post.innerHTML = element.title;
                $postsWrap.appendChild(post);
            });
        }
        )        
    })

    $btnPost.addEventListener('click', () => {        
        const newPost = {
            title: 'Title',
            body: 'Some text',
            userId: 1
        }
        createPost(newPost, (res) => {
            console.log('res', res);
        });
    })
}

export default practice;