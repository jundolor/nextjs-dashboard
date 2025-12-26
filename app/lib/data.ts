import { neon } from "@neondatabase/serverless";

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';



const sql = neon(process.env.DATABASE_URL!)

export async function fetchRevenue() {
    try{
        // Artificially delay a response for demo purposes.
        // Don't do this in production :)

        // console.log('Fetching revenue data...');
         await new Promise((resolve) => setTimeout(resolve, 3500));

        const data = await sql`SELECT * FROM revenue`;

         console.log('Data fetch completed after 3 seconds.');

        return data as Revenue[];
    }
    catch(error){
        console.error('Database error:',error)
        throw new Error('Failed to fetch Revenue data')
    }
}

export async function fetchLatestInvoices(){
    try{
        
        const data = await sql `
        SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        ORDER BY invoices.date DESC
        LIMIT 5` as LatestInvoiceRaw[]

        const latestInvoices = data.map((invoice) => ({
        ...invoice,
        amount: formatCurrency(invoice.amount),
        }));
        return latestInvoices;
    }
    catch(error) {
        console.error('Database error:',error)
        throw new Error('Failed to fetch Revenue data')
    }
}
type CardData = {
  invoiceCount: number
  customerCount: number
  totalPaidInvoices: number
  totalPendingInvoices: number
}

type CountRow = {
  count: string
}

type StatusSumRow = {
  paid: number | null
  pending: number | null
}

export async function fetchCardData(): Promise<CardData> {
  try {
    const invoiceCountPromise = sql`
      SELECT COUNT(*) AS count FROM invoices
    `

    const customerCountPromise = sql`
      SELECT COUNT(*) AS count FROM customers
    `

    const invoiceStatusPromise = sql`
      SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
      FROM invoices
    `

    const [
      invoiceCountRaw,
      customerCountRaw,
      invoiceStatusRaw,
    ] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ])

    const invoiceCount = Number((invoiceCountRaw as CountRow[])[0]?.count ?? 0)
    const customerCount = Number((customerCountRaw as CountRow[])[0]?.count ?? 0)

    const statusSums = (invoiceStatusRaw as StatusSumRow[])[0]

    return {
      invoiceCount,
      customerCount,
      totalPaidInvoices: statusSums?.paid ?? 0,
      totalPendingInvoices: statusSums?.pending ?? 0,
    }
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch Revenue data')
  }
}

const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const invoices = sql `
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `

    return invoices
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string){
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }

}

export async function fetchCustomers(): Promise<CustomerField[]>{
  try {
    const customers = await sql `
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    ` 
    return customers as CustomerField[]

  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}