from tensorflow import keras
import numpy as np
import pandas as pd

calorie = {'Sedentary':1.2,
           'Lightly Active':1.375,
           'Moderately Active': 1.55,
           'Very Active': 1.725,
           'Extremely Active': 1.9}

def recommend_user_specific(user_id, no_of_recipes=10, model='Matrix Factorization'):
    if model == 'Matrix Factorization':
        model = keras.models.load_model('recommenders\mf_model.h5')

        dish_embedding_learnt = model.get_layer(name='recipe-embedding').get_weights()[0]
        user_embedding_learnt = model.get_layer(name='user-embedding').get_weights()[0]

        return recommend(user_id, dish_embedding_learnt, user_embedding_learnt, no_of_recipes)

def recommend(user_id, dish_embedding_learnt, user_embedding_learnt, number_of_recipes=10):
    dishes = user_embedding_learnt[user_id]@dish_embedding_learnt.T
    dish_ids = np.argpartition(dishes, -number_of_recipes)[-number_of_recipes:]
    return [ int(i) for i in dish_ids]

def health_userbased(user_id,no_of_recipes):
    a = recommend_user_specific(user_id,no_of_recipes = 150)

    users = pd.read_csv("C:\\Users\\dskk2\\FRS Project\\users.csv")
    nutrition = pd.read_csv("C:\\Users\\dskk2\\FRS Project\\nutrients.csv")

    health = nutrition.iloc[a]
    health = health[(health['fat'] >= 5) & (health['fat'] <= 20) & (health['carbohydrates'] >= 5)& (health['carbohydrates'] <= 20)& (health['protein'] >= 5)& (health['protein'] <= 20)& (health['sodium'] >= 5)& (health['sodium'] <= 20)]

    calorie_intake = calorie[users.loc[5,'activity']]*users.loc[5,'bmr']
    health = health[health['calories(amt)'] <= calorie_intake]
    health = health.sort_values('calories(amt)')

    health_list = list(health['_id'])[:no_of_recipes]
    popular = list(set(a) - set(health_list))[:no_of_recipes]
    return {
        "user_based" : popular,
        "health_based" : health_list
    }
    