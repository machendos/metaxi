import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('client').insert([
    { clientName: 'Ernie Orozco' },
    { clientName: 'Wiktor Hume' },
    { clientName: 'Lorenzo Kidd' },
    { clientName: 'Umayr Booker' },
    { clientName: 'Darcy Leech' },
    { clientName: 'Andrea Arroyo' },
    { clientName: 'Zak England' },
    { clientName: 'Storm Currie' },
    { clientName: 'Zuzanna Green' },
    { clientName: 'Adnaan Mckay' },
    { clientName: 'Karam Hinton' },
    { clientName: 'Zakariyah Bass' },
    { clientName: 'Marissa Corona' },
    { clientName: 'Griffin Small' },
    { clientName: 'Dougie Clarkson' },
    { clientName: 'Sidra Wilkins' },
    { clientName: 'Kole Hicks' },
    { clientName: 'Conna Castro' },
  ]);
}
