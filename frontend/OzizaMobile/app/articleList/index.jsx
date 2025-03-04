import React from "react";
import dummyArticles from "../../utils/dummyData";

const ArticleList = () => {
    return (
        <div>
            <h1>Articles</h1>
            <ul>
                {dummyArticles.map(article => (
                    <li key={article.id}>
                        <h2>{article.title}</h2>
                        <img src={article.image} alt={article.title} style={{ width: '100%', height: 'auto' }} />
                        <p>{article.content}</p>
                        <p><em>By {article.author} on {article.date}</em></p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticleList;
