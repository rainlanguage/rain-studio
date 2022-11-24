import { supabaseClient } from "$lib/supabaseClient";
import type { Database } from "$lib/types/generated-db-types";
import type { ExpressionRow } from "$lib/types/types";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const createNewExpression = async (expression: Omit<Database['public']['Tables']['draft_expressions']['Insert'], 'raw_expression' | 'notes' | 'name'>) => {
    const _expression = { ...expression, notes: '', raw_expression: '', name: 'Untitled expression' }
    return await saveExpression(_expression)
}
export const saveExpression = async (expression: Database['public']['Tables']['draft_expressions']['Insert']): Promise<PostgrestSingleResponse<ExpressionRow>> => {
    const newExpression = await supabaseClient
        .from('draft_expressions')
        .insert(expression)
        .select('*').single();
    return newExpression;
};

export const saveExpressionCopy = async (expression: Database['public']['Tables']['draft_expressions']['Insert']): Promise<ReturnType<typeof saveExpression>> => {
    const expressionCopy = { ...expression, name: `Copy of ${expression.name}` }
    return await saveExpression(expressionCopy)
}