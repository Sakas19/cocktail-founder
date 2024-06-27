import React, { useState, useEffect } from 'react';
import Modal from '../Modal/index';
import styles from './cocktails.module.scss';
import Loader from '../Loader';

interface cocktailsData {
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
  [key: string]: string | undefined;
}

const Cocktail: React.FC = () => {
  const [cocktail, setCocktail] = useState<cocktailsData | null>(null);

  const [showModal, setShowModal] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextDrinkClick = () => {
    fetchData();
  };

  const extractIngredients = (data: cocktailsData) => {
    const ingredients = [];
    let i = 1;
  
    while (data[`strIngredient${i}`] && i <= 15) {
        const ingredient = data[`strIngredient${i}`];
        const measure = data[`strMeasure${i}`] || "";
        ingredients.push(`${measure} ${ingredient}`);
        i++;
    }
  
    return ingredients;
  };

  if (!cocktail) return <div><Loader /></div>;

  return (
    <div className={styles.container}>
      <h1>Cocktail Founder</h1>
      {showModal && <Modal message="🍹 Cheers to good times, but remember to sip wisely and giggle responsibly!" onClose={handleCloseModal} />}
        <ul>
            {extractIngredients(cocktail).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
            ))}
        </ul>
        <h2 className={styles.drink}>{cocktail.strDrink}</h2>
        <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} className={styles.image}/>
        <p>{cocktail.strInstructions}</p>
        <button className={styles.button} onClick={handleNextDrinkClick}>Next Drink!</button>
    </div>
  );
}

export default Cocktail;

