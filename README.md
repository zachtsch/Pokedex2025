# Welcome to the Capstone 2025 Pokedex Project!

https://pokedex2025--6xks6oawbw.expo.app/

This is a react native Pokedex project created with Expo Go for Capstone: Software Engineering. We used [https://pokeapi.co/] to fetch the Pokemon data. The app consists of the following components:

   1. Main Component
      * scrollable flatlist that contains 1025 pokemon, clicking on a pokemon redirects the user to the pokemon's about section which contains detailed information of the pokemon.
      * we grabbed the main components background image from [https://www.reddit.com/r/pokemon/comments/1gdlts/i_made_you_guys_a_background/?rdt=62964] and was created by u/Sandi315. When asked in the comments, the reddit user greenlit others using their work. 

   2. About Component
      * contains information about any given pokemon including a brief description and the pokemon's weight, height, type, and id.
      * also includes an evolution button that redirects the user to the pokemon's evolution chain

   3. Evolution Chain
      * displays a given pokemon's position in its evolution chain.

   4. Search Component
      * the search tab allows the user to search for a desired pokemon, either by its name or id.

   5. Random Pokemon
      * the random tab allows the user to click a button that generates a random pokemon.

## To get started

   1. Install dependencies

      ```bash
      npm install
      ```

   2. Start the app

      ```bash
      npx expo start
      ```

   3. To run on the web push 'w', otherwise 'i' for ios and 'a' for andriod. 
