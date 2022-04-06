import { plugin } from '../src';
import { buildSchema } from 'graphql';

describe('Testing Union Types=>Flutter Freezed Classes Plugin', () => {
  //  given this schema
  const schema = buildSchema(/* GraphQL */ `
    type Movie {
      id: ID!
      title: String!
    }

    input CreateMovieInput {
      title: String!
    }

    input UpsertMovieInput {
      id: ID!
      title: String!
    }

    input UpdateMovieInput {
      id: ID!
      title: String
    }

    input DeleteMovieInput {
      id: ID!
    }

    enum Episode {
      NEWHOPE
      EMPIRE
      JEDI
    }

    type Starship {
      id: ID!
      name: String!
      length: Float
    }

    interface Character {
      id: ID!
      name: String!
      friends: [Character]
      appearsIn: [Episode]!
    }

    # type Character {
    #   name: String!
    #   appearsIn: [Episode]!
    # }

    type Human implements Character {
      id: ID!
      name: String!
      friends: [Character]
      appearsIn: [Episode]!
      starships: [Starship]
      totalCredits: Int
    }

    type Droid implements Character {
      id: ID!
      name: String!
      friends: [Character]
      appearsIn: [Episode]!
      primaryFunction: String
    }

    union SearchResult = Human | Droid | Starship

    scalar UUID
    scalar timestamptz
    scalar jsonb

    input AInput {
      b: BInput!
    }

    input BInput {
      c: CInput!
    }

    input CInput {
      a: AInput!
    }

    type ComplexType {
      a: [String]
      b: [ID!]
      c: [Boolean!]!
      d: [[Int]]
      e: [[Float]!]
      f: [[String]!]!
      g: jsonb
      h: timestamptz!
      i: UUID!
    }
  `);
});
