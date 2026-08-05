// frontend/src/api/api.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  QueryDocumentSnapshot, // если используется только как тип, тоже можно вынести в import type
} from "firebase/firestore";

import { db } from '../firebase'; 

// Импортируем типы отдельно
import type { DocumentData } from "firebase/firestore";
import type { Product, Order } from "../types";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";

// Вспомогательная функция для преобразования snapshot в массив с id
const snapshotToArray = <T>(snapshot: QueryDocumentSnapshot<DocumentData>[]): (T & { id: string })[] => {
  return snapshot.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
};

// ----- ТОВАРЫ -----
export const getProducts = async (): Promise<(Product & { id: string })[]> => {
  const productsCol = collection(db, PRODUCTS_COLLECTION);
  const productSnapshot = await getDocs(productsCol);
  return snapshotToArray<Product>(productSnapshot.docs);
};

export const getProductsByStore = async (storeId: number): Promise<(Product & { id: string })[]> => {
  const productsCol = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsCol, where("store_id", "==", storeId));
  const productSnapshot = await getDocs(q);
  return snapshotToArray<Product>(productSnapshot.docs);
};

export const addProduct = async (productData: Omit<Product, "id">): Promise<Product & { id: string }> => {
  const productsCol = collection(db, PRODUCTS_COLLECTION);
  const docRef = await addDoc(productsCol, productData);
  return { id: docRef.id, ...productData };
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product & { id: string }> => {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(productDoc, productData);
  return { id, ...productData } as Product & { id: string };
};

export const deleteProduct = async (id: string): Promise<string> => {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(productDoc);
  return id;
};

// ----- ЗАКАЗЫ -----
export const addOrder = async (orderData: Omit<Order, "id" | "createdAt" | "status">): Promise<Order & { id: string }> => {
  const ordersCol = collection(db, ORDERS_COLLECTION);
  const docRef = await addDoc(ordersCol, {
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...orderData, status: "pending", createdAt: new Date().toISOString() };
};

export const getOrders = async (): Promise<(Order & { id: string })[]> => {
  const ordersCol = collection(db, ORDERS_COLLECTION);
  const orderSnapshot = await getDocs(ordersCol);
  return snapshotToArray<Order>(orderSnapshot.docs);
};

export const updateOrderStatus = async (id: string, status: Order["status"]): Promise<void> => {
  const orderDoc = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(orderDoc, { status, updatedAt: new Date().toISOString() });
};

export const api = {
  getProducts,
  getProductsByStore,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  addOrder,
  updateOrderStatus,
};