
import pandas as pd

def knn_content(distance_method, recipe_id, N):
    recipe = pd.read_csv('dish.csv')
    recipe = recipe.drop(columns=['image_url', 'cooking_directions', 'reviews'])

    recipe.aver_rate = recipe.aver_rate.astype(float)
    recipe = recipe.sort_values(by = 'aver_rate',ascending=False)
    recipe = recipe.iloc[:int(recipe.shape[0]/2),:]

    df = pd.read_csv('nutrients.csv')
    df = df.iloc[recipe['_id']]
    df = df.set_index('_id')
    df = df.dropna()

    # normalized nutrition data by columns
    df_normalized = (df-df.mean())/df.std()
    df_normalized.columns = df.columns
    df_normalized.index = df.index
    
    allRecipes = pd.DataFrame(df_normalized.index)
    allRecipes = allRecipes[allRecipes._id != recipe_id]
    allRecipes["distance"] = allRecipes["_id"].apply(lambda x: distance_method(df_normalized.loc[recipe_id], df_normalized.loc[x]))
    TopNRecommendation = allRecipes.sort_values(["distance"]).head(N).sort_values(by=['distance', '_id'])
    
    recipe_df = recipe.set_index('_id')
    recipe_id = [recipe_id]
    recipe_list = []
    for recipeid in TopNRecommendation._id:
        recipe_id.append(recipeid)   # list of recipe id of selected recipe and recommended recipe(s)
        recipe_list.append("{}  {}".format(recipeid, recipe_df.at[recipeid, 'name']))
    
    return df_normalized.loc[recipe_id, :]