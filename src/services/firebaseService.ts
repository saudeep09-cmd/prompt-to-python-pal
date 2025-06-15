
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CodingRequest } from '@/types/workflow';

export class FirebaseService {
  private requestsCollection = 'coding_requests';

  async saveRequest(userId: string, request: Omit<CodingRequest, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.requestsCollection), {
        ...request,
        userId,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving request:', error);
      throw error;
    }
  }

  async updateRequest(requestId: string, updates: Partial<CodingRequest>): Promise<void> {
    try {
      const requestRef = doc(db, this.requestsCollection, requestId);
      await updateDoc(requestRef, updates);
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  async getUserRequests(userId: string): Promise<CodingRequest[]> {
    try {
      const q = query(
        collection(db, this.requestsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CodingRequest));
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();
