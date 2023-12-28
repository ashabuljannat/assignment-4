### *** kichu user na thay createdAt a null asteche
### 1. user registration

- Response: if course any field not given then show error

```
  {
    "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-01T12:00:00.000Z"
    }
````
```
    craete korar jonno use kora hoyeche
      {
    timestamps: true,
  },
```

### 2. user login

```json
user name : john_doe000
user pass : John_doe000

admin name : john_doe111
admin pass : John_doe111
```

### 3. change password

```json
1. hash(16) kore compare korar somoy 3min+ lime lage, tai 8 diye kora hoyeche.
2. previous password name duita field kore compare + set kora hoyeche. 
```

### 4.Create a Course (Only Admin can do this)*

```json
{
    user_role admin set kore, token e set kora hoyeche.
     auth middleware e seta check kora hoyeche.
     static pre diye createdBy te userid set kora hoyeche.
}
```

### 5. Get Paginated and Filtered Courses.

```json
req query theke field niye sevabe filter + short + populet kora hoyeche
  

```

### 6.Create a Category (Only Admin can do this)**

```json
user_role admin set kore, token e set kora hoyeche.
     auth middleware e seta check kora hoyeche.
      static pre diye createdBy te userid set kora hoyeche.
```

### 7. . Get All Categories**

```json

find + populet('createdBy) kora hoyeche
```

### 8. Create a Review (Only the user can do this)**

```json
 
user_role user set kore, token e set kora hoyeche.
     auth middleware e seta check kora hoyeche.
      static pre diye createdBy te userid set kora hoyeche.
      created data ke populet kore createdby dekhano hoyeche
```

### 9. Update a Course (Only Admin can do this)**

```json
 
user_role admin set kore, token e set kora hoyeche.
     auth middleware e seta check kora hoyeche.
     tag e addToSet use kora hoyeche.
```
### 10**. Get Course by ID with Reviews**

```json
find + populet('createdBy) kora hoyeche
```
### 11**. Get the Best Course Based on Average Review (Rating)**

```json
review er rate ar avr ber kore best kora hoyeche.
find + populet('createdBy) kora hoyeche
```

**run this program:**

- run `tsc` for compile the code to js
- run `npm run start:dev` for start code in ts-node-dev server
- run `npm run lint` for catch eslint error
- run `npm run prettier` for code formatter
