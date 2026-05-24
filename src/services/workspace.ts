import { api } from './api';

export const workspaceService = {
  /**
   * Generates a Google Docs document of a grimoire entry or study notes.
   */
  exportToGoogleDocs: async (title: string, contentMarkdown: string) => {
    try {
      const response = await api.workspace.saveDoc(title, contentMarkdown);
      return response;
    } catch (err: any) {
      console.error('Failed to export document to Google Docs:', err);
      throw err;
    }
  },

  /**
   * Generates a PDF of a course completion certificate and stores it in the user's Google Drive.
   */
  exportCertificateToDrive: async (courseTitle: string, studentName: string) => {
    try {
      const response = await api.workspace.saveCertificate(courseTitle, studentName);
      return response;
    } catch (err: any) {
      console.error('Failed to store certificate in Google Drive:', err);
      throw err;
    }
  }
};
