import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Idea, IdeaFormData } from '../types';

const COLLECTION_NAME = 'ideas';

// Firestore 문서를 Idea 타입으로 변환
const convertDocToIdea = (docId: string, data: any): Idea => {
  return {
    id: docId,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    status: data.status,
    tags: data.tags || [],
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

// Idea를 Firestore 문서로 변환
const convertIdeaToDoc = (idea: IdeaFormData) => {
  return {
    ...idea,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};

// 업데이트용 데이터 변환
const convertUpdateData = (idea: Partial<IdeaFormData>) => {
  return {
    ...idea,
    updatedAt: serverTimestamp(),
  };
};

export const firebaseService = {
  // 모든 아이디어 가져오기
  async getAllIdeas(): Promise<Idea[]> {
    try {
      const ideasCol = collection(db, COLLECTION_NAME);
      const q = query(ideasCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => convertDocToIdea(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  },

  // 단일 아이디어 가져오기
  async getIdea(id: string): Promise<Idea | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertDocToIdea(docSnap.id, docSnap.data());
      }
      return null;
    } catch (error) {
      console.error('Error fetching idea:', error);
      throw error;
    }
  },

  // 아이디어 생성
  async createIdea(ideaData: IdeaFormData): Promise<Idea> {
    try {
      const ideasCol = collection(db, COLLECTION_NAME);
      const docData = convertIdeaToDoc(ideaData);
      const docRef = await addDoc(ideasCol, docData);
      
      // 생성된 문서 가져오기
      const newDoc = await getDoc(docRef);
      return convertDocToIdea(newDoc.id, newDoc.data());
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    }
  },

  // 아이디어 업데이트
  async updateIdea(id: string, ideaData: Partial<IdeaFormData>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = convertUpdateData(ideaData);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  },

  // 아이디어 삭제
  async deleteIdea(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  },

  // 카테고리별 아이디어 가져오기
  async getIdeasByCategory(category: string): Promise<Idea[]> {
    try {
      const ideasCol = collection(db, COLLECTION_NAME);
      const q = query(
        ideasCol,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => convertDocToIdea(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching ideas by category:', error);
      throw error;
    }
  },

  // 상태별 아이디어 가져오기
  async getIdeasByStatus(status: string): Promise<Idea[]> {
    try {
      const ideasCol = collection(db, COLLECTION_NAME);
      const q = query(
        ideasCol,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => convertDocToIdea(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching ideas by status:', error);
      throw error;
    }
  },

  // 실시간 구독
  subscribeToIdeas(callback: (ideas: Idea[]) => void): () => void {
    const ideasCol = collection(db, COLLECTION_NAME);
    const q = query(ideasCol, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideas = snapshot.docs.map(doc => convertDocToIdea(doc.id, doc.data()));
      callback(ideas);
    }, (error) => {
      console.error('Error in real-time subscription:', error);
    });

    return unsubscribe;
  },

  // 검색
  async searchIdeas(searchTerm: string): Promise<Idea[]> {
    try {
      // Firestore는 전체 텍스트 검색을 직접 지원하지 않으므로
      // 모든 아이디어를 가져와서 클라이언트에서 필터링
      const ideas = await this.getAllIdeas();
      const lowercaseSearch = searchTerm.toLowerCase();
      
      return ideas.filter(idea => 
        idea.title.toLowerCase().includes(lowercaseSearch) ||
        idea.description.toLowerCase().includes(lowercaseSearch) ||
        idea.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
      );
    } catch (error) {
      console.error('Error searching ideas:', error);
      throw error;
    }
  },

  // 태그로 아이디어 가져오기
  async getIdeasByTag(tag: string): Promise<Idea[]> {
    try {
      const ideasCol = collection(db, COLLECTION_NAME);
      const q = query(
        ideasCol,
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => convertDocToIdea(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching ideas by tag:', error);
      throw error;
    }
  },

  // 최근 아이디어 가져오기
  async getRecentIdeas(limitCount: number = 10): Promise<Idea[]> {
    try {
      const ideasCol = collection(db, COLLECTION_NAME);
      const q = query(
        ideasCol,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => convertDocToIdea(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching recent ideas:', error);
      throw error;
    }
  },
};