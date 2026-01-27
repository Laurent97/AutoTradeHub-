import { supabase } from './client';

export interface LoanApplication {
  id: string;
  application_number: string;
  partner_id: string;
  user_id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  credit_score?: number;
  annual_revenue?: number;
  tax_id?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
  applied_date: string;
  approved_date?: string;
  rejected_date?: string;
  reviewed_date?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  documents: any[];
  created_at: string;
  updated_at: string;
}

export interface LoanApplicationInput {
  partner_id: string;
  user_id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  credit_score?: number;
  annual_revenue?: number;
  tax_id?: string;
  documents?: any[];
}

export interface LoanApplicationWithDetails extends LoanApplication {
  partner_store_name?: string;
  partner_store_slug?: string;
  partner_contact_email?: string;
  partner_contact_phone?: string;
  partner_country?: string;
  partner_city?: string;
  user_full_name?: string;
  user_email?: string;
  reviewer_name?: string;
  reviewer_email?: string;
}

export const loanService = {
  /**
   * Create a new loan application
   */
  async createLoanApplication(data: LoanApplicationInput) {
    try {
      const { data: resultData, error } = await supabase
        .from('loan_applications')
        .insert({
          ...data,
          documents: data.documents || []
        })
        .select()
        .single();

      if (error) throw error;
      return { data: resultData, error: null };
    } catch (error) {
      console.error('Error creating loan application:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to create loan application' 
      };
    }
  },

  /**
   * Get loan applications for admin dashboard
   */
  async getAdminLoanApplications(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('v_loan_applications_admin')
        .select('*')
        .order('applied_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching admin loan applications:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to fetch loan applications' 
      };
    }
  },

  /**
   * Get loan applications for a specific partner
   */
  async getPartnerLoanApplications(userId: string, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('v_loan_applications_partner')
        .select('*')
        .order('applied_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching partner loan applications:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to fetch loan applications' 
      };
    }
  },

  /**
   * Get a specific loan application by ID
   */
  async getLoanApplicationById(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('v_loan_applications_admin')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching loan application:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch loan application' 
      };
    }
  },

  /**
   * Approve a loan application
   */
  async approveLoanApplication(applicationId: string, adminId: string, adminNotes?: string) {
    try {
      const { data, error } = await supabase
        .rpc('approve_loan_application', {
          p_application_id: applicationId,
          p_admin_id: adminId,
          p_admin_notes: adminNotes
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error approving loan application:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to approve loan application' 
      };
    }
  },

  /**
   * Reject a loan application
   */
  async rejectLoanApplication(applicationId: string, adminId: string, rejectionReason: string, adminNotes?: string) {
    try {
      const { data, error } = await supabase
        .rpc('reject_loan_application', {
          p_application_id: applicationId,
          p_admin_id: adminId,
          p_rejection_reason: rejectionReason,
          p_admin_notes: adminNotes
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error rejecting loan application:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to reject loan application' 
      };
    }
  },

  /**
   * Update loan application status
   */
  async updateLoanApplicationStatus(applicationId: string, status: string, adminId?: string, notes?: string, adminNotes?: string) {
    try {
      const updateFields: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved') {
        updateFields.approved_date = new Date().toISOString();
        updateFields.reviewed_date = new Date().toISOString();
        updateFields.reviewed_by = adminId;
        if (adminNotes) updateFields.admin_notes = adminNotes;
      } else if (status === 'rejected') {
        updateFields.rejected_date = new Date().toISOString();
        updateFields.reviewed_date = new Date().toISOString();
        updateFields.reviewed_by = adminId;
        if (notes) updateFields.rejection_reason = notes;
        if (adminNotes) updateFields.admin_notes = adminNotes;
      } else if (status === 'under_review') {
        updateFields.reviewed_date = new Date().toISOString();
        updateFields.reviewed_by = adminId;
        if (adminNotes) updateFields.admin_notes = adminNotes;
      }

      const { data: resultData, error } = await supabase
        .from('loan_applications')
        .update(updateFields)
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;
      return { data: resultData, error: null };
    } catch (error) {
      console.error('Error updating loan application status:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to update loan application status' 
      };
    }
  },

  /**
   * Search and filter loan applications
   */
  async searchLoanApplications(filters: {
    searchTerm?: string;
    status?: string;
    dateRange?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('v_loan_applications_admin')
        .select('*')
        .order('applied_date', { ascending: false });

      // Apply search filter
      if (filters.searchTerm) {
        query = query.or(`
          business_name.ilike.%${filters.searchTerm}%, 
          contact_person.ilike.%${filters.searchTerm}%, 
          email.ilike.%${filters.searchTerm}%, 
          application_number.ilike.%${filters.searchTerm}%
        `);
      }

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(filters.dateRange));
        query = query.gte('applied_date', daysAgo.toISOString());
      }

      // Apply pagination
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error searching loan applications:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to search loan applications' 
      };
    }
  },

  /**
   * Get loan application statistics
   */
  async getLoanApplicationStats() {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('status, loan_amount, applied_date')
        .order('applied_date', { ascending: false });

      if (error) throw error;

      const applications = data || [];
      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        under_review: applications.filter(app => app.status === 'under_review').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        cancelled: applications.filter(app => app.status === 'cancelled').length,
        total_loan_amount: applications.reduce((sum, app) => sum + (app.loan_amount || 0), 0),
        approved_loan_amount: applications
          .filter(app => app.status === 'approved')
          .reduce((sum, app) => sum + (app.loan_amount || 0), 0),
        average_loan_amount: applications.length > 0 
          ? applications.reduce((sum, app) => sum + (app.loan_amount || 0), 0) / applications.length 
          : 0
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching loan application stats:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch loan application stats' 
      };
    }
  },

  /**
   * Upload document for loan application
   */
  async uploadDocument(applicationId: string, file: File, documentType: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${applicationId}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('loan_documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('loan_documents')
        .getPublicUrl(fileName);

      // Update application documents array
      const { data, error } = await supabase
        .from('loan_applications')
        .select('documents')
        .eq('id', applicationId)
        .single();

      if (error) throw error;

      const updatedDocuments = [
        ...(data.documents || []),
        {
          name: file.name,
          type: documentType,
          url: urlData.publicUrl,
          uploaded_at: new Date().toISOString()
        }
      ];

      const { data: updateData, error: updateError } = await supabase
        .from('loan_applications')
        .update({ documents: updatedDocuments })
        .eq('id', applicationId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: updateData, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to upload document' 
      };
    }
  },

  /**
   * Delete document from loan application
   */
  async deleteDocument(applicationId: string, documentUrl: string) {
    try {
      // Extract file path from URL
      const url = new URL(documentUrl);
      const filePath = url.pathname.split('/').pop();

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('loan_documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Update application documents array
      const { data, error } = await supabase
        .from('loan_applications')
        .select('documents')
        .eq('id', applicationId)
        .single();

      if (error) throw error;

      const updatedDocuments = (data.documents || []).filter((doc: any) => doc.url !== documentUrl);

      const { data: updateData, error: updateError } = await supabase
        .from('loan_applications')
        .update({ documents: updatedDocuments })
        .eq('id', applicationId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { data: updateData, error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to delete document' 
      };
    }
  }
};
