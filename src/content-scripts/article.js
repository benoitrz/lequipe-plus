const apiUrl = 'https://dwh.lequipe.fr/api/v1/efr/news/';

const processResponse = (response) => {
  if (response?.is_premium && !response?.is_longform) {
    const articleBody = response.items.find((item) => item.layout === 'article_body');
    const paragraphs = articleBody.objet.paragraphs;
    const articleDiv = document.getElementsByClassName('article__body')[0];
    if (articleDiv) {
      // hide paywall style
      document.getElementsByClassName('Article__paywall')[0].style.display = 'none';
      document.getElementsByClassName('Article__gradient')[0].style.display = 'none';
      articleDiv.innerHTML = '';
      paragraphs.forEach((paragraph) => {
        // first paragraph is already present at the top of the article
        if (paragraph.layout !== 'chapo' && paragraph.content) {
          const paragraphToInsert = document.createElement('p');
          paragraphToInsert.innerHTML = paragraph.content;
          paragraphToInsert.className = 'Paragraph__content';
          articleDiv.appendChild(paragraphToInsert);
        }
      });
    }
  }
}

window.addEventListener('load', () => {
  const paywallDiv = document.getElementsByClassName('Article__paywall')[0];
  if (paywallDiv) {
    const currentUrl = window.location.href;
    const lastSlashPosition = currentUrl.lastIndexOf('/');
    const articleId = currentUrl.substring(lastSlashPosition + 1);
    if (articleId) {
      fetch(apiUrl + articleId)
      .then((response) => response.json())
      .then((response) => {
        processResponse(response);
      });
    }
  }
});