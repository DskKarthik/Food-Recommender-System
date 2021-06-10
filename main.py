from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from flask_jwt import JWT, jwt_required
import db
import orders_util

app = Flask(__name__)
api = Api(app)
CORS(app)

class Order(Resource):

    order_parser = reqparse.RequestParser()
    order_parser.add_argument(
        'rest_ID',
        required="True",
        help = "Restaurant not specified..."
    )

    order_parser.add_argument(
        'dish_ID',
        required="True",
        help = "Dish not specified..."
    )

    order_parser.add_argument(
        'username',
        required="True",
        help = "Username not specified..."
    )

    order_details = reqparse.RequestParser()
    order_details.add_argument(
        'username',
        required="True",
        help = "Username Not Provided"
    )

    order_details.add_argument(
        'date',
        required="True",
        help = "Date Not Provided"
    )
    order_details.add_argument(
        'time'
    )

    order_details.add_argument(
        'bill',
        required="True",
        help = "Bill Not Provided"
    )

    def get(self, rest_ID, dish_ID):
        
        for order in orders_util.dskk_orders:
            if order['order1']['rest_ID'] == rest_ID and order['order1']['dish_ID'] == dish_ID:
                return order['order1']

    def post(self, rest_ID, dish_ID):
        data = Order.order_details.parse_args()
        print(data)
        username = data['username']
        date = data['date']
        time = data['time']
        bill = data['bill']
        orders_util.update_order(rest_ID, dish_ID, username,time, date, bill)
        return {"Message": "Order Updated Sucsesfully"}

    def put(self):
        pass

    def delete(self):
        pass

class User_Orders(Resource):

    def get(self,  username):
        orders = orders_util.get_user_orders(username)
        return orders

class Test(Resource):

    productArray = [
    {
      "name": "Dish 1",
      "restId": 101,
      "dishId": 20,
      "actual cost": "200",
      "discounted price": "150",
      "rating": 5
    },

    {
      "name": "Dish 2",
      "restId": 102,
      "dishId": 21,
      "actual cost": "400",
      "discounted price": "375",
      "rating": 4
    },

    {
      "name": "Dish 3",
      "restId": 102,
      "dishId": 25,
      "actual cost": "300",
      "discounted price": "200",
      "rating": 3
    },

    {
      "name": "Dish 4",
      "actual cost": "450",
      "restId": 105,
      "dishId": 40,
      "discounted price": "300",
      "rating": 4
    }
  ]

    productArray2 = [
    {
      "name": "Popular Dish 1",
      "actual cost": "200",
      "discounted price": "150",
      "rating": 5
    },

    {
      "name": "Polular Dish 2",
      "actual cost": "400",
      "discounted price": "375",
      "rating": 4
    },

    {
      "name": "Popular Dish 3",
      "actual cost": "300",
      "discounted price": "200",
      "rating": 3
    },

    {
      "name": "Popular Dish 4",
      "actual cost": "450",
      "discounted price": "300",
      "rating": 4
    }
    ] 

    def get(self):
        return {
            "productArray": self.productArray,
            "productArray2": self.productArray2
        }

class User(Resource):

  user_parser = reqparse.RequestParser()
  user_add_parser = reqparse.RequestParser()
  user_parser.add_argument('Username', required="True", help="Username not specified")
  user_parser.add_argument('First_name', required="True", help="First Name not specified")
  user_parser.add_argument('Last_name', required="True", help="Last Name not specified")
  user_parser.add_argument('Age', required="True", help="Age not specified")
  user_parser.add_argument('Gender', required="True", help="Gender not specified")
  user_parser.add_argument('Email', required="True", help="Email not specified")
  user_parser.add_argument('Password', required="True", help="Passwrd not specified")
  user_parser.add_argument('Account_status', required="True", help="Acc status not specified")
  user_parser.add_argument('previelege', required="True", help="Passwrd not specified")
  user_parser.add_argument('Code', required="True", help="Missing code")
  user_parser.add_argument('Number', required="True", help="Missing Number")
  
  user_add_parser.add_argument('Username', required="True", help="Username not specified")
  user_add_parser.add_argument('house_no', required='True')
  user_add_parser.add_argument('locality', required='True')
  user_add_parser.add_argument('city', required='True')
  user_add_parser.add_argument('state', required='True')
  user_add_parser.add_argument('pincode', required='True')
  user_add_parser.add_argument('Address_name', required='True')

  def post(self):
    user_data = User.user_parser.parse_args()
    print('='*50)
    print(user_data)
    print('='*50)
    user_add_data = User.user_add_parser.parse_args()
    return db.registerUser(user_data, user_add_data), 201

class Restaurant(Resource):

  rest_parser = reqparse.RequestParser()
  rest_phone_parser = reqparse.RequestParser()
  rest_parser.add_argument('restId', required=True, help="Missing Rest ID")
  rest_parser.add_argument('restName', required=True, help="Missing")
  rest_parser.add_argument('email', required=True, help="Missing")
  rest_parser.add_argument('password', required=True, help="Missing")
  rest_parser.add_argument('streetNo', required=True, help="Missing")
  rest_parser.add_argument('locality', required=True, help="Missing")
  rest_parser.add_argument('city', required=True, help="Missing")
  rest_parser.add_argument('state', required=True, help="Missing")
  rest_parser.add_argument('pincode', required=True, help="Missing")
  rest_parser.add_argument('speciality', required=True, help="Missing speciality")
  rest_parser.add_argument('rating')

  rest_phone_parser.add_argument('restId', required="True", help="")
  rest_phone_parser.add_argument('code', required="True")
  rest_phone_parser.add_argument('number', required="True")

  def post(self):
    rest_data = Restaurant.rest_parser.parse_args()
    rest_phone_data = Restaurant.rest_phone_parser.parse_args()

    print('='*50)
    print(rest_data)
    print('='*50)

    return db.registerRestaurant(rest_data, rest_phone_data), 201

class Driver(Resource):

    def post(self):
        data = request.get_json()
        return db.registerDriver(data)

class AddDish(Resource):

    def post(self):
        data = dict(request.get_json())

        # dish_data = data['dishData']
        # dish_tags = data['dishTags']
        # tagsArray = dish_tags.split(' ')
        return db.addDish(data)

class GetRestList(Resource):

	def get(self):
		city  = request.args.get('city')
		rest_list = db.getRestaurants(city)
		print(rest_list)
		return {"Restaurant details": rest_list}

class GetDishes(Resource):

	def get(self, restId):
		dishList = db.getDishes(restId)
		print(dishList)
		return dishList

class GetDishDetails(Resource):

	def get(self, restId, dishId):
		details = db.showDish(restId, dishId)
		print(details)
		return details
  
class UserAdminLogin(Resource):

  def post(self):

    data = request.get_json()
    username = data['userName']
    password = data['password']

    result = db.login(username, password)
    return result
  
class RestLogin(Resource):

  def post(self):

    data = request.get_json()
    restId = data['restId']
    password = data['password']
    return db.restLogin(restId, password)

class UpdateOrder(Resource):

	def post(self):
		data = dict(request.get_json())
		# print(data)
		orderData = list(data['orderDetails'].values())
		orderDishes = data['orderDishes']
		
		db.updateOrder(orderData, orderDishes)

		return {"Message": "Order Updated Sucsessfully!"}

class AdminStats(Resource):

	def get(self):
		return db.getAdminStats()

class GetOrders(Resource):

	def get(self, username):
		orders = db.getOrders(username)
		# print(orders)
		return orders
  
class GetLatestOrderId(Resource):

  def get(self, username):
    return db.getLatestOrderId(username)

class GetOrderStatus(Resource):

  def get(self):
    orderId = request.args.get('orderId')
    result = db.getOrderStatus(orderId)
    return result

class UpdateOrderStatus(Resource):

  def post(self):
    data = request.get_json()
    print(data)
    orderId = data['orderId']
    status = data['status']
    return db.updateOrderStatus(orderId, status)

class UpdateDishOrderRating(Resource):

  def post(self):
    data = request.get_json()
    orderId = data['orderId']
    restId = data['restId']
    dishId = data['dishId']
    rating = data['ratingValue']

    return db.updateRating(orderId, restId, dishId, rating)

class GetPopularAndTrendingDishes(Resource):

  def get(self, city):
    recommendations = dict()
    trending_dishes, popular_dishes, health_dishes = db.getCityDishes(city)
    recommendations['trending'] = trending_dishes
    recommendations['popular'] = popular_dishes
    recommendations['health'] = health_dishes
    return recommendations

class GetUserRecommendations(Resource):

  def get(self, username):
    return db.getRecommendations(username)

api.add_resource(Order, '/order/<string:rest_ID>/<string:dish_ID>')
api.add_resource(User_Orders, '/<string:username>/orders')
api.add_resource(Test, '/getProductArray')
api.add_resource(User, '/updateUser')
api.add_resource(Restaurant, '/updateRestaurant')
api.add_resource(Driver, '/updateDriver')
api.add_resource(AddDish, '/addDish')
api.add_resource(GetRestList, '/getRestaurants')
api.add_resource(GetDishes, '/getDishes/<int:restId>')
api.add_resource(GetDishDetails, '/item-details/<int:restId>/<int:dishId>')
api.add_resource(UserAdminLogin, '/verifyUser')
api.add_resource(RestLogin, '/verifyRest')
api.add_resource(UpdateOrder, '/updateOrder')
api.add_resource(AdminStats, '/adminStats')
api.add_resource(GetOrders, '/getOrders/<string:username>')
api.add_resource(GetLatestOrderId,  '/getLatestOrderId/<string:username>')
api.add_resource(GetOrderStatus, '/getOrderStatus')
api.add_resource(UpdateOrderStatus, '/updateOrderStatus')
api.add_resource(UpdateDishOrderRating, '/updateRating')
api.add_resource(GetPopularAndTrendingDishes, '/getPopularTrending/<string:city>')
api.add_resource(GetUserRecommendations, '/userRecommendations/<string:username>')

if __name__ == "__main__":
    app.run(debug=True)