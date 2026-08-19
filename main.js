import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getSession } from 'next-auth/react';
import { getUser } from '../lib/user';
import { getRooms } from '../lib/room';
import { getCreeps } from '../lib/creep';
import { getSpawns } from '../lib/spawn';
import { getStructures } from '../lib/structure';
import { getConstructionSites } from '../lib/constructionSite';
import { getFlags } from '../lib/flag';
import { getPowerCreeps } from '../lib/powerCreep';
import { getNukes } from '../lib/nuker';
import { getMarket } from '../lib/market';
import { getTerminal } from '../lib/terminal';
import { getStorage } from '../lib/storage';
import { getObserver } from '../lib/observer';
import { getPowerSpawn } from '../lib/powerSpawn';
import { getFactory } from '../lib/factory';
import { getInvaderCore } from '../lib/invaderCore';
import { getKeeperLair } from '../lib/keeperLair';
import { getSource } from '../lib/source';
import { getMineral } from '../lib/mineral';
import { getDeposit } from '../lib/deposit';
import { getRuin } from '../lib/ruin';
import { getTombstone } from '../lib/tombstone';
import { getPortal } from '../lib/portal';
import { getController } from '../lib/controller';
import { getNuker } from '../lib/nuker';
import { getPowerBank } from '../lib/powerBank';
import { getLab } from '../lib/lab';
import { getLink } from '../lib/link';
import { getExtractor } from '../lib/extractor';
import { getContainer } from '../lib/container';
import { getRoad } from '../lib/road';
import { getRampart } from '../lib/rampart';
import { getWall } from '../lib/wall';
import { getTower } from '../lib/tower';
import { getExtractor } from '../lib/extractor';
import { getContainer } from '../lib/container';
import { getRoad } from '../lib/road';
import { getRampart } from '../lib/rampart';
import { getWall } from '../lib/wall';
import { getTower } from '../lib/tower';
import { getExtractor } from '../lib/extractor';
import { getContainer } from '../lib/container';
import { getRoad } from '../lib/road';
import { getRampart } from '../lib/rampart';
import { getWall } from '../lib/wall';
import { getTower } from '../lib/tower';

const Dashboard = ({ user, rooms, creeps, spawns, structures, constructionSites, flags, powerCreeps, nukes, market, terminal, storage, observer, powerSpawn, factory, invaderCore, keeperLair, sources, minerals, deposits, ruins, tombstones, portals, controllers, nukers, powerBanks, labs, links, extractors, containers, roads, ramparts, walls, towers }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [session, status, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error.message}</span>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            {/* Content goes here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await getUser(session.user.email);
  const rooms = await getRooms(user.id);
  const creeps = await getCreeps(user.id);
  const spawns = await getSpawns(user.id);
  const structures = await getStructures(user.id);
  const constructionSites = await getConstructionSites(user.id);
  const flags = await getFlags(user.id);
  const powerCreeps = await getPowerCreeps(user.id);
  const nukes = await getNukes(user.id);
  const market = await getMarket(user.id);
  const terminal = await getTerminal(user.id);
  const storage = await getStorage(user.id);
  const observer = await getObserver(user.id);
  const powerSpawn = await getPowerSpawn(user.id);
  const factory = await getFactory(user.id);
  const invaderCore = await getInvaderCore(user.id);
  const keeperLair = await getKeeperLair(user.id);
  const sources = await getSource(user.id);
  const minerals = await getMineral(user.id);
  const deposits = await getDeposit(user.id);
  const ruins = await getRuin(user.id);
  const tombstones = await getTombstone(user.id);
  const portals = await getPortal(user.id);
  const controllers = await getController(user.id);
  const nukers = await getNuker(user.id);
  const powerBanks = await getPowerBank(user.id);
  const labs = await getLab(user.id);
  const links = await getLink(user.id);
  const extractors = await getExtractor(user.id);
  const containers = await getContainer(user.id);
  const roads = await getRoad(user.id);
  const ramparts = await getRampart(user.id);
  const walls = await getWall(user.id);
  const towers = await getTower(user.id);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      user,
      rooms,
      creeps,
      spawns,
      structures,
      constructionSites,
      flags,
      powerCreeps,
      nukes,
      market,
      terminal,
      storage,
      observer,
      powerSpawn,
      factory,
      invaderCore,
      keeperLair,
      sources,
      minerals,
      deposits,
      ruins,
      tombstones,
      portals,
      controllers,
      nukers,
      powerBanks,
      labs,
      links,
      extractors,
      containers,
      roads,
      ramparts,
      walls,
      towers,
    },
  };
}

export default Dashboard;