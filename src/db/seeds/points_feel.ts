import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('point').insert([
    { pointTitle: '15, Volodymyrska Street' },
    { pointTitle: '6-b, Smolycha Street' },
    { pointTitle: '2, Nimetska Street (Palats Ukraina metro station)' },
    { pointTitle: '15, Holosiivska Street (Holosiivska metro station)' },
    { pointTitle: '34, Rosiyska Street' },
    { pointTitle: '3, Oleksandra Koshitsia Street (Kharkivska metro station)' },
    { pointTitle: '19-a, Petra Zaporozhtsia Street' },
    { pointTitle: '24, KrakivskaStreet (Darnytsia metro station)' },
    { pointTitle: '9-b, Entuziastiv Street' },
    { pointTitle: '14, Kaunaska Street' },
    { pointTitle: '2, Chervonotkatska Street (Livoberezhna metro station)' },
    { pointTitle: '25-a, AvtozavodskaStree' },
    { pointTitle: '27-d, Pryrichna Street' },
    { pointTitle: '21-a, Fedora Maksymenka Street' },
    { pointTitle: '2-a, Marshala Malynovskoho Street (Obolon metro station)' },
    { pointTitle: '9-b, Teodora Drayzera Street' },
    { pointTitle: '18, RadunskaStreet' },
    { pointTitle: '7-a, Yanhelya Street (Shuliavska metro station)' },
  ]);
}
