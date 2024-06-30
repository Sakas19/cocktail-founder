import React, { useState, useEffect } from 'react';
import Modal from '../Modal/index';
import styles from './cocktails.module.scss';
import Loader from '../Loader';

interface CocktailsData {
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
  [key: string]: string | undefined;
}

const Cocktail: React.FC = () => {
  const [cocktail, setCocktail] = useState<CocktailsData | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<CocktailsData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchRandomCocktail = async () => {
    setLoading(true);
    let data;
    let ingredientCount = 0;

    while (ingredientCount !== 5) {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      data = await response.json();

      ingredientCount = 0;
      for (let i = 1; i <= 15; i++) {
        if (data.drinks[0][`strIngredient${i}`]) {
          ingredientCount++;
        }
      }
    }

    setCocktail(data.drinks[0]);
    setLoading(false);
  };

  const fetchSearchedCocktail = async (query: string) => {
    setLoading(true);
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    if (data.drinks) {
      setSearchResult(data.drinks[0]);
    } else {
      setSearchResult(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomCocktail();
  }, []);

  const handleNextDrinkClick = () => {
    fetchRandomCocktail();
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchSearchedCocktail(searchQuery);
  };

  const extractIngredients = (data: CocktailsData) => {
    const ingredients = [];
    let i = 1;

    while (data[`strIngredient${i}`] && i <= 15) {
      const ingredient = data[`strIngredient${i}`];
      const measure = data[`strMeasure${i}`] || '';
      ingredients.push(`${measure} ${ingredient}`);
      i++;
    }

    return ingredients;
  };

  const displayCocktail = searchResult || cocktail;

  if (loading) return <div><Loader /></div>;

  if (!displayCocktail) return <div>No cocktail found.</div>;

  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Cocktail Founder</h1>
      {showModal && <Modal message="🍹 Cheers to good times, but remember to sip wisely and giggle responsibly!" onClose={handleCloseModal} />}
      <div className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a cocktail"
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>
      <img src={displayCocktail.strDrinkThumb} alt={displayCocktail.strDrink} className={styles.image} />
      <h2 className={styles.drink}>{displayCocktail.strDrink}</h2>
      <ul>
        {extractIngredients(displayCocktail).map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <p>{displayCocktail.strInstructions}</p>
      <button className={styles.button} onClick={handleNextDrinkClick}>Next Drink!</button>
    </div>
  );
};

export default Cocktail;

