import { IApiKey, IArticle, Wrapped } from '../../app/interfaces';

const submitBtn = document.querySelector('.submit-input') as HTMLElement;

const searchInput = document.querySelector('.search-input') as HTMLInputElement;

async function handleSearch() {
    const keyWord = searchInput.value;
    const apiKey: Readonly<IApiKey> = '9df73b9103bf44149cab4e959d5dd37d';
    const response = await fetch(`https://newsapi.org/v2/everything?q=${keyWord}&apiKey=${apiKey}`, {
        method: 'GET',
    });
    const result = await response.json();
    handleSearchResult(result.articles);
    return result.articles;
}

async function handleSearchResult(data: Wrapped<IArticle>) {
    try {
        const news: IArticle[] = data.length >= 10 ? data.filter((_item: IArticle, idx: number) => idx < 10) : data;
        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp') as HTMLTemplateElement;

        news.forEach((item: IArticle, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as HTMLElement;

            if (idx % 2) {
                const newsItem = newsClone.querySelector('.news__item') as HTMLElement;
                newsItem.classList.add('alt');
            }
            const newsMetaPhoto = newsClone.querySelector('.news__meta-photo') as HTMLElement;

            newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || '../../../../assets/9.jpg'})`;
            const newsMetaAuthor = newsClone.querySelector('.news__meta-author') as HTMLElement;
            newsMetaAuthor.textContent = item.author || item.source.name;

            const NewsMetaDate = newsClone.querySelector('.news__meta-date') as HTMLElement;
            NewsMetaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

            const NewsDecsrTitle = newsClone.querySelector('.news__description-title') as HTMLElement;
            NewsDecsrTitle.textContent = item.title;

            const NewsDecsrSorce = newsClone.querySelector('.news__description-source') as HTMLElement;
            NewsDecsrSorce.textContent = item.source.name;

            const NewsDecsrContent = newsClone.querySelector('.news__description-content') as HTMLElement;
            NewsDecsrContent.textContent = item.description;
            const NewsReadMore = newsClone.querySelector('.news__read-more a') as HTMLElement;
            NewsReadMore.setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const newsBlock = document.querySelector('.news') as HTMLElement;
        newsBlock.innerHTML = '';
        const newsBlock1 = document.querySelector('.news') as HTMLElement;
        newsBlock1.appendChild(fragment);
    } catch (err) {
        console.log('Server does not respond');
    }
}

export { handleSearch, submitBtn };
