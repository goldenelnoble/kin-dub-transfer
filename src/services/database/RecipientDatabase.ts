
import { supabase } from "@/integrations/supabase/client";

export class RecipientDatabase {
  static async createRecipient(recipientData: any) {
    console.log('Creating recipient in database...');
    
    const { data: recipientData: dbRecipient, error: recipientError } = await supabase
      .from('recipients')
      .insert({
        name: recipientData.name,
        phone: recipientData.phone
      })
      .select()
      .single();

    if (recipientError) {
      console.error('Error creating recipient:', recipientError);
      throw recipientError;
    }

    return dbRecipient;
  }

  static async getRecipientById(id: string) {
    const { data: recipientData, error: recipientError } = await supabase
      .from('recipients')
      .select('*')
      .eq('id', id)
      .single();

    if (recipientError) {
      console.warn(`Failed to fetch recipient ${id}:`, recipientError);
      return null;
    }

    return recipientData;
  }

  static async resetAllRecipients() {
    console.log('Resetting all recipient data...');
    
    const { error: recipientsError } = await supabase
      .from('recipients')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (recipientsError) {
      console.error('Error deleting recipients:', recipientsError);
      throw recipientsError;
    }
  }
}
