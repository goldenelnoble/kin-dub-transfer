
import { supabase } from "@/integrations/supabase/client";

export class SenderDatabase {
  static async createSender(senderData: any) {
    console.log('Creating sender in database...');
    
    const { data: senderData: dbSender, error: senderError } = await supabase
      .from('senders')
      .insert({
        name: senderData.name,
        phone: senderData.phone,
        id_number: senderData.idNumber,
        id_type: senderData.idType
      })
      .select()
      .single();

    if (senderError) {
      console.error('Error creating sender:', senderError);
      throw senderError;
    }

    return dbSender;
  }

  static async getSenderById(id: string) {
    const { data: senderData, error: senderError } = await supabase
      .from('senders')
      .select('*')
      .eq('id', id)
      .single();

    if (senderError) {
      console.warn(`Failed to fetch sender ${id}:`, senderError);
      return null;
    }

    return senderData;
  }

  static async resetAllSenders() {
    console.log('Resetting all sender data...');
    
    const { error: sendersError } = await supabase
      .from('senders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (sendersError) {
      console.error('Error deleting senders:', sendersError);
      throw sendersError;
    }
  }
}
