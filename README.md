- Many Closet API: api that manages the relation between clothes seller and his clients.
- This api manages all nesseary features of the related to the subject in details.
- Dependencies:
  - github.com/go-sql-driver/mysql v1.8.1.
  - github.com/golang-jwt/jwt/v4 v4.5.0.
  - github.com/imagekit-developer/imagekit-go v0.0.0-20240521071536-1d7e6e67fcd7.
  - github.com/joho/godotenv v1.5.1.
  - github.com/olahol/melody v1.2.1 ==> websocket liberary.
  - golang.org/x/crypto v0.26.0.
  - gorm.io/driver/mysql v1.5.7.
  - gorm.io/gorm v1.25.11 ==> golang ORM liberary.
  - golang.org/x/oauth2 v0.23.0 ==> oauth2 liberary
- Services:
  - mySQL.
  - imageKit: files storage service.
  - chargily: online payment service.
  - email.
  - oauth providers (Google, Facebook, Microsoft, Github).
- Features:
  - auth: email and password login and registration with email verification and password reset and support for open authentification such as:
    - Google.
    - Facebook.
    - Microsoft.
    - Github (definitly not for users 😉)
  - products: CRUDing collections and items with detailed search and pignation.
  - reviews: CRUDing reviews with detailed search and pignation.
  - users: RUDing users with detailed search and pignation with support for admin actions (enabling and disabling users ...ext).
  - analytics: realtime updates about total products, products by sales, totalcorders, orders by status, order trends, total revenue, total registered users, new users, active users, most reviewed products.
  - notifications: realtime updates for notifcations and notifications statistics (status ...ext).
- Tips:
  - you can directly use the source code by placing your `.env` file in `./lib` folder with the following keys:
    - DB_USER.
    - DB_PASSWORD.
    - DB_HOST.
    - DB_PORT.
    - DB_NAME.
    - JWT_SECRET.
    - EMAIL: production email.
    - PASSWORD: 2 steps verification password of the production email.
    - CHARGILY_SECRET_KEY.
    - IMAGEKIT_PUBLIC_KEY.
    - IMAGEKIT_PRIVATE_KEY.
    - IMAGEKIT_ENDPOINT_URL.
    - GOOGLE_CLIENT_ID.
    - GOOGLE_CLIENT_SECRET.
    - GITHUB_CLIENT_ID.
    - GITHUB_CLIENT_SECRET.
    - FACEBOOK_CLIENT_ID.
    - FACEBOOK_CLIENT_SECRET.
    - MICROSOFT_CLIENT_ID.
    - MICROSOFT_CLIENT_SECRET.
  - This API covers some unpopular topics in golang you can take it a refrence or tutorial of you face such topics:
    - using Golang:1.22.0's `http/net`'s new features to build complete API.
    - using `gorm.io`'s hooks with `melody` to provide complex realtime updates.

Enjoy it 😊
