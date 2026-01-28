import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

// GraphQL Queries
const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      slug
      description
      cuisineType
      priceRange
      formattedAddress
      region
      city
      phone
      status
    }
  }
`;

const GET_SMARTCAKULA_MENUITEM = gql`
  query GetSmartCakulaMenuItem($uid: ID!) {
    getMenuItem(uid: $uid) {
      status
      message
      data {
        uid
        name
        description
        price
        image
        isAvailable
        categoryUid
        restaurantUid
      }
    }
  }
`;

const GET_SMARTCAKULA_RESTAURANT_BY_UID = gql`
  query GetSmartCakulaRestaurantByUid($uid: ID!) {
    restaurantByUid(uid: $uid) {
      status
      message
      data {
        uid
        name
        description
        phoneNumber
        region
        city
        isOpen
        openingTime
        closingTime
        ownerUid
        image
        type
        rank
        adress
        websiteUrl
        days
      }
    }
  }
`;

const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id
      name
      slug
      description
      cuisineType
      priceRange
      formattedAddress
      region
      city
      phone
      website
      status
      menuItems {
        id
        name
        description
        price
        category
        imageUrl
        isAvailable
      }
    }
  }
`;

const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: ID!) {
    menuItems(restaurantId: $restaurantId) {
      id
      name
      description
      price
      category
      imageUrl
      isAvailable
      portionSize
      preparationTime
      calories
      dietaryTags
    }
  }
`;

const GET_REGIONS = gql`
  query GetRegions {
    regions {
      id
      name
      code
      description
      isActive
    }
  }
`;

const GET_RESERVATIONS = gql`
  query GetReservations($restaurantId: ID) {
    reservations(restaurantId: $restaurantId) {
      id
      confirmationCode
      reservationDate
      reservationTime
      partySize
      status
      guestName
      guestEmail
      guestPhone
      specialRequests
      restaurant {
        id
        name
      }
    }
  }
`;

const GET_REVIEWS = gql`
  query GetReviews($restaurantId: ID!) {
    reviews(restaurantId: $restaurantId) {
      id
      priceFairness
      serviceClarity
      menuAccuracy
      comment
      isVerified
      createdAt
      user {
        fullName
      }
    }
  }
`;

const GET_SMARTCAKULA_RESTAURANTS = gql`
  query GetSmartCakulaRestaurants {
    restaurants {
      status
      message
      data {
        uid
        name
        description
        phoneNumber
        region
        city
        isOpen
        openingTime
        closingTime
        ownerUid
        image
        type
        rank
        adress
        websiteUrl
        days
      }
    }
  }
`;

const GET_SMARTCAKULA_CATEGORIES = gql`
  query GetSmartCakulaCategories {
    getCategoryService {
      status
      message
      data {
        uid
        name
        description
        restaurantUid
        isActive
      }
    }
  }
`;

const GET_SMARTCAKULA_MENUITEMS_BY_RESTAURANT = gql`
  query GetSmartCakulaMenuItemsByRestaurant($restaurantUid: ID!) {
    getMenuItemsByRestaurant(restaurantUid: $restaurantUid) {
      status
      message
      data {
        uid
        name
        description
        price
        image
        isAvailable
        categoryUid
        restaurantUid
      }
    }
  }
`;

const GET_SMARTCAKULA_MENUITEMS_BY_CATEGORY = gql`
  query GetSmartCakulaMenuItemsByCategory($categoryUid: ID!) {
    getMenuItemsByCategory(categoryUid: $categoryUid) {
      status
      message
      data {
        uid
        name
        description
        price
        image
        isAvailable
        categoryUid
        restaurantUid
      }
    }
  }
`;

const CREATE_SMARTCAKULA_MENUITEM = gql`
  mutation CreateSmartCakulaMenuItem($input: MenuItemInput!) {
    createMenuItem(input: $input) {
      status
      message
      data {
        uid
        name
        description
        price
        image
        isAvailable
        categoryUid
        restaurantUid
      }
    }
  }
`;

const UPDATE_SMARTCAKULA_MENUITEM = gql`
  mutation UpdateSmartCakulaMenuItem($uid: ID!, $input: MenuItemInput!) {
    updateMenuItem(uid: $uid, input: $input) {
      status
      message
      data {
        uid
        name
        description
        price
        image
        isAvailable
        categoryUid
        restaurantUid
      }
    }
  }
`;

const DELETE_SMARTCAKULA_MENUITEM = gql`
  mutation DeleteSmartCakulaMenuItem($uid: ID!) {
    deleteMenuItem(uid: $uid) {
      status
      message
    }
  }
`;

const CREATE_SMARTCAKULA_CATEGORY = gql`
  mutation CreateSmartCakulaCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      status
      message
      data {
        uid
        name
        description
        restaurantUid
        isActive
      }
    }
  }
`;

const UPDATE_SMARTCAKULA_CATEGORY = gql`
  mutation UpdateSmartCakulaCategory($input: CategoryInput!) {
    updateCategory(input: $input) {
      status
      message
      data {
        uid
        name
        description
        restaurantUid
        isActive
      }
    }
  }
`;

const DELETE_SMARTCAKULA_CATEGORY = gql`
  mutation DeleteSmartCakulaCategory($uid: ID!) {
    deleteCategory(uid: $uid) {
      status
      message
    }
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      fullName
      role
    }
  }
`;

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      token
      user {
        uid
        fullName
        email
        phone
        role
        isActive
        createdAt
      }
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationInput!) {
    createReservation(input: $input) {
      id
      confirmationCode
      reservationDate
      reservationTime
      partySize
      status
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      id
      priceFairness
      serviceClarity
      menuAccuracy
      comment
    }
  }
`;

const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($input: RestaurantInput!) {
    createRestaurant(input: $input) {
      id
      name
      slug
      status
    }
  }
`;

const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($id: ID!, $input: RestaurantInput!) {
    updateRestaurant(id: $id, input: $input) {
      id
      name
      slug
      status
    }
  }
`;

const CREATE_MENU_ITEM = gql`
  mutation CreateMenuItem($input: MenuItemInput!) {
    createMenuItem(input: $input) {
      id
      name
      price
      category
    }
  }
`;

const UPDATE_MENU_ITEM = gql`
  mutation UpdateMenuItem($id: ID!, $input: MenuItemInput!) {
    updateMenuItem(id: $id, input: $input) {
      id
      name
      price
      category
    }
  }
`;

const DELETE_MENU_ITEM = gql`
  mutation DeleteMenuItem($id: ID!) {
    deleteMenuItem(id: $id)
  }
`;

const UPDATE_RESERVATION_STATUS = gql`
  mutation UpdateReservationStatus($id: ID!, $status: String!) {
    updateReservationStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const CREATE_SMARTCAKULA_RESTAURANT = gql`
  mutation CreateRestaurant($input: RestaurantInput!) {
    createRestaurant(input: $input) {
      status
      message
      data {
        uid
        name
        description
        phoneNumber
        region
        city
        isOpen
        openingTime
        closingTime
        ownerUid
        image
        type
        rank
        adress
        websiteUrl
        days
      }
    }
  }
`;

const UPDATE_SMARTCAKULA_RESTAURANT = gql`
  mutation UpdateRestaurant($input: RestaurantInput!) {
    updateRestaurant(input: $input) {
      status
      message
      data {
        uid
        name
        description
        phoneNumber
        region
        city
        isOpen
        openingTime
        closingTime
        ownerUid
        image
        type
        rank
        adress
        websiteUrl
        days
      }
    }
  }
`;

// Types
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cuisineType?: string;
  priceRange?: string;
  formattedAddress?: string;
  region?: string;
  city?: string;
  phone?: string;
  website?: string;
  status: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  portionSize?: string;
  preparationTime?: number;
  calories?: number;
  dietaryTags?: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  confirmationCode: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  status: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
  restaurant?: { id: string; name: string };
}

export interface Review {
  id: string;
  priceFairness?: boolean;
  serviceClarity?: boolean;
  menuAccuracy?: boolean;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  user?: { fullName: string };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface ReservationInput {
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}

export interface ReviewInput {
  restaurantId: string;
  reservationId?: string;
  priceFairness?: boolean;
  serviceClarity?: boolean;
  menuAccuracy?: boolean;
  comment?: string;
}

export interface RestaurantInput {
  name: string;
  description?: string;
  cuisineType?: string;
  priceRange?: string;
  formattedAddress?: string;
  region?: string;
  city?: string;
  phone?: string;
  website?: string;
}

export interface MenuItemInput {
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
  portionSize?: string;
  preparationTime?: number;
  calories?: number;
  dietaryTags?: string;
}

export interface SmartCakulaRestaurantInput {
  uid?: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  region?: string;
  city?: string;
  isOpen?: string;
  openingTime?: string;
  closingTime?: string;
  ownerUid: string;
  image?: string;
  type?: string;
  rank?: string;
  adress?: string;
  websiteUrl?: string;
  days?: string;
}

export interface SmartCakulaRestaurant {
  uid: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  region?: string;
  city?: string;
  isOpen?: string;
  openingTime?: string;
  closingTime?: string;
  ownerUid: string;
  image?: string;
  type?: string;
  rank?: string;
  adress?: string;
  websiteUrl?: string;
  days?: string;
}

export interface SmartCakulaCategoryInput {
  uid?: string;
  name: string;
  description?: string;
  restaurantUid: string;
}

export interface SmartCakulaCategory {
  uid: string;
  name: string;
  description?: string;
  restaurantUid: string;
  isActive: boolean;
}

export interface SmartCakulaMenuItemInput {
  uid?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  categoryUid: string;
  restaurantUid: string;
}

export interface SmartCakulaMenuItem {
  uid: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  categoryUid: string;
  restaurantUid: string;
}

export interface SmartCakulaResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface SmartCakulaListResponse<T> {
  status: string;
  message?: string;
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class GraphQLService {
  private apollo = inject(Apollo);

  // Queries
  getRestaurants(): Observable<Restaurant[]> {
    return this.apollo.query<{ restaurants: Restaurant[] }>({
      query: GET_RESTAURANTS
    }).pipe(map(result => result.data!.restaurants));
  }

  getRestaurant(id: string): Observable<Restaurant> {
    return this.apollo.query<{ restaurant: Restaurant }>({
      query: GET_RESTAURANT,
      variables: { id }
    }).pipe(map(result => result.data!.restaurant));
  }

  getMenuItems(restaurantId: string): Observable<MenuItem[]> {
    return this.apollo.query<{ menuItems: MenuItem[] }>({
      query: GET_MENU_ITEMS,
      variables: { restaurantId }
    }).pipe(map(result => result.data!.menuItems));
  }

  getRegions(): Observable<Region[]> {
    return this.apollo.query<{ regions: Region[] }>({
      query: GET_REGIONS
    }).pipe(map(result => result.data!.regions));
  }

  getReservations(restaurantId?: string): Observable<Reservation[]> {
    return this.apollo.query<{ reservations: Reservation[] }>({
      query: GET_RESERVATIONS,
      variables: { restaurantId }
    }).pipe(map(result => result.data!.reservations));
  }

  getReviews(restaurantId: string): Observable<Review[]> {
    return this.apollo.query<{ reviews: Review[] }>({
      query: GET_REVIEWS,
      variables: { restaurantId }
    }).pipe(map(result => result.data!.reviews));
  }

  getCurrentUser(): Observable<User> {
    return this.apollo.query<{ currentUser: User }>({
      query: GET_CURRENT_USER
    }).pipe(map(result => result.data!.currentUser));
  }

  // Mutations
  login(email: string, password: string): Observable<AuthPayload> {
    return this.apollo.mutate<{ login: { token: string; user: { uid: string; fullName: string; email: string; phone?: string; role: string; isActive?: boolean; createdAt?: string } } }>({
      mutation: LOGIN_MUTATION,
      variables: { identifier: email, password }
    }).pipe(
      map(result => {
        const login = result.data!.login;
        return {
          accessToken: login.token,
          user: {
            id: login.user.uid,
            email: login.user.email,
            fullName: login.user.fullName,
            role: login.user.role,
            phone: login.user.phone,
            isActive: login.user.isActive,
            createdAt: login.user.createdAt,
          }
        };
      })
    );
  }

  createReservation(input: ReservationInput): Observable<Reservation> {
    return this.apollo.mutate<{ createReservation: Reservation }>({
      mutation: CREATE_RESERVATION,
      variables: { input }
    }).pipe(map(result => result.data!.createReservation));
  }

  createReview(input: ReviewInput): Observable<Review> {
    return this.apollo.mutate<{ createReview: Review }>({
      mutation: CREATE_REVIEW,
      variables: { input }
    }).pipe(map(result => result.data!.createReview));
  }

  createRestaurant(input: RestaurantInput): Observable<Restaurant> {
    return this.apollo.mutate<{ createRestaurant: Restaurant }>({
      mutation: CREATE_RESTAURANT,
      variables: { input }
    }).pipe(map(result => result.data!.createRestaurant));
  }

  updateRestaurant(id: string, input: RestaurantInput): Observable<Restaurant> {
    return this.apollo.mutate<{ updateRestaurant: Restaurant }>({
      mutation: UPDATE_RESTAURANT,
      variables: { id, input }
    }).pipe(map(result => result.data!.updateRestaurant));
  }

  createMenuItem(input: MenuItemInput): Observable<MenuItem> {
    return this.apollo.mutate<{ createMenuItem: MenuItem }>({
      mutation: CREATE_MENU_ITEM,
      variables: { input }
    }).pipe(map(result => result.data!.createMenuItem));
  }

  updateMenuItem(id: string, input: MenuItemInput): Observable<MenuItem> {
    return this.apollo.mutate<{ updateMenuItem: MenuItem }>({
      mutation: UPDATE_MENU_ITEM,
      variables: { id, input }
    }).pipe(map(result => result.data!.updateMenuItem));
  }

  deleteMenuItem(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteMenuItem: boolean }>({
      mutation: DELETE_MENU_ITEM,
      variables: { id }
    }).pipe(map(result => result.data!.deleteMenuItem));
  }

  updateReservationStatus(id: string, status: string): Observable<Reservation> {
    return this.apollo.mutate<{ updateReservationStatus: Reservation }>({
      mutation: UPDATE_RESERVATION_STATUS,
      variables: { id, status }
    }).pipe(map(result => result.data!.updateReservationStatus));
  }

  createSmartCakulaRestaurant(input: SmartCakulaRestaurantInput): Observable<SmartCakulaResponse<SmartCakulaRestaurant>> {
    return this.apollo.mutate<{ createRestaurant: SmartCakulaResponse<SmartCakulaRestaurant> }>({
      mutation: CREATE_SMARTCAKULA_RESTAURANT,
      variables: { input }
    }).pipe(map(result => result.data!.createRestaurant));
  }

  getSmartCakulaRestaurants(): Observable<SmartCakulaRestaurant[]> {
    return this.apollo.query<{ restaurants: SmartCakulaListResponse<SmartCakulaRestaurant> }>({
      query: GET_SMARTCAKULA_RESTAURANTS,
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data!.restaurants.data));
  }

  getSmartCakulaRestaurantByUid(uid: string): Observable<SmartCakulaRestaurant> {
    return this.apollo.query<{ restaurantByUid: SmartCakulaResponse<SmartCakulaRestaurant> }>({
      query: GET_SMARTCAKULA_RESTAURANT_BY_UID,
      variables: { uid },
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data!.restaurantByUid.data));
  }

  updateSmartCakulaRestaurant(input: SmartCakulaRestaurantInput): Observable<SmartCakulaResponse<SmartCakulaRestaurant>> {
    return this.apollo.mutate<{ updateRestaurant: SmartCakulaResponse<SmartCakulaRestaurant> }>({
      mutation: UPDATE_SMARTCAKULA_RESTAURANT,
      variables: { input }
    }).pipe(map(result => result.data!.updateRestaurant));
  }

  getSmartCakulaCategories(): Observable<SmartCakulaCategory[]> {
    return this.apollo.query<{ getCategoryService: SmartCakulaListResponse<SmartCakulaCategory> }>({
      query: GET_SMARTCAKULA_CATEGORIES,
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data!.getCategoryService.data));
  }

  createSmartCakulaCategory(input: SmartCakulaCategoryInput): Observable<SmartCakulaResponse<SmartCakulaCategory>> {
    return this.apollo.mutate<{ createCategory: SmartCakulaResponse<SmartCakulaCategory> }>({
      mutation: CREATE_SMARTCAKULA_CATEGORY,
      variables: { input }
    }).pipe(map(result => result.data!.createCategory));
  }

  updateSmartCakulaCategory(input: SmartCakulaCategoryInput): Observable<SmartCakulaResponse<SmartCakulaCategory>> {
    return this.apollo.mutate<{ updateCategory: SmartCakulaResponse<SmartCakulaCategory> }>({
      mutation: UPDATE_SMARTCAKULA_CATEGORY,
      variables: { input }
    }).pipe(map(result => result.data!.updateCategory));
  }

  deleteSmartCakulaCategory(uid: string): Observable<{ status: string; message?: string }>{
    return this.apollo.mutate<{ deleteCategory: { status: string; message?: string } }>({
      mutation: DELETE_SMARTCAKULA_CATEGORY,
      variables: { uid }
    }).pipe(map(result => result.data!.deleteCategory));
  }

  getSmartCakulaMenuItemsByRestaurant(restaurantUid: string): Observable<SmartCakulaMenuItem[]> {
    return this.apollo.query<{ getMenuItemsByRestaurant: SmartCakulaListResponse<SmartCakulaMenuItem> }>({
      query: GET_SMARTCAKULA_MENUITEMS_BY_RESTAURANT,
      variables: { restaurantUid },
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data!.getMenuItemsByRestaurant.data));
  }

  getSmartCakulaMenuItemsByCategory(categoryUid: string): Observable<SmartCakulaMenuItem[]> {
    return this.apollo.query<{ getMenuItemsByCategory: SmartCakulaListResponse<SmartCakulaMenuItem> }>({
      query: GET_SMARTCAKULA_MENUITEMS_BY_CATEGORY,
      variables: { categoryUid },
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data!.getMenuItemsByCategory.data));
  }

  createSmartCakulaMenuItem(input: SmartCakulaMenuItemInput): Observable<SmartCakulaListResponse<SmartCakulaMenuItem>> {
    return this.apollo.mutate<{ createMenuItem: SmartCakulaListResponse<SmartCakulaMenuItem> }>({
      mutation: CREATE_SMARTCAKULA_MENUITEM,
      variables: { input }
    }).pipe(map(result => result.data!.createMenuItem));
  }

  updateSmartCakulaMenuItem(uid: string, input: SmartCakulaMenuItemInput): Observable<SmartCakulaResponse<SmartCakulaMenuItem>> {
    return this.apollo.mutate<{ updateMenuItem: SmartCakulaResponse<SmartCakulaMenuItem> }>({
      mutation: UPDATE_SMARTCAKULA_MENUITEM,
      variables: { uid, input }
    }).pipe(map(result => result.data!.updateMenuItem));
  }

  deleteSmartCakulaMenuItem(uid: string): Observable<{ status: string; message?: string }>{
    return this.apollo.mutate<{ deleteMenuItem: { status: string; message?: string } }>({
      mutation: DELETE_SMARTCAKULA_MENUITEM,
      variables: { uid }
    }).pipe(map(result => result.data!.deleteMenuItem));
  }

  getSmartCakulaMenuItem(uid: string): Observable<SmartCakulaMenuItem | null> {
    return this.apollo.query<{ getMenuItem: SmartCakulaResponse<SmartCakulaMenuItem> }>({
      query: GET_SMARTCAKULA_MENUITEM,
      variables: { uid },
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data?.getMenuItem?.data ?? null));
  }
}
