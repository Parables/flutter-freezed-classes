// generating freezed classes

/* 

type Book {
  id: ID!
  cover: String
  title: String!
  bookCode: String
  author: String
  inStock: Int!
  courses: [Course!]
  created_at: DateTime!
  updated_at: DateTime!
}

*/

/* 
@freezed
class Book with _$Book {

  factory Book({

  }) = _Book;

  factory Book.fromJson(Map<String, dynamic> json) => _$BookFromJson(json);
}

 */
/* 
@freezed
class Book with _$Book {

  factory Book() = _Book;

  factory Book.fromJson(Map<String, dynamic> json) => _$BookFromJson(json);
} */
