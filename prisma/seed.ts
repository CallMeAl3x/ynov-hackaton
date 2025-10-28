import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with users and stories...");

  // Clean up existing data (optional - comment out if you want to preserve existing data)
  await prisma.conversation.deleteMany();
  await prisma.message.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.character.deleteMany();
  await prisma.story.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("password456", 10);
  const hashedPassword3 = await bcrypt.hash("password789", 10);
  const hashedPassword4 = await bcrypt.hash("passwordabc", 10);
  const hashedPassword5 = await bcrypt.hash("passworddef", 10);

  // Create 5 users
  const user1 = await prisma.user.create({
    data: {
      name: "Marie Dubois",
      email: "marie.dubois@example.com",
      password: hashedPassword1,
      emailVerified: new Date(),
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Pierre Leclerc",
      email: "pierre.leclerc@example.com",
      password: hashedPassword2,
      emailVerified: new Date(),
      role: "USER",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      password: hashedPassword3,
      emailVerified: new Date(),
      role: "USER",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: "Jean Martin",
      email: "jean.martin@example.com",
      password: hashedPassword4,
      emailVerified: new Date(),
      role: "USER",
    },
  });

  const user5 = await prisma.user.create({
    data: {
      name: "Isabelle Rousseau",
      email: "isabelle.rousseau@example.com",
      password: hashedPassword5,
      emailVerified: new Date(),
      role: "USER",
    },
  });

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@admin.com",
      password: adminPassword,
      emailVerified: new Date(),
      role: "ADMIN",
    },
  });

  console.log("✅ Created 5 users + 1 admin");

  // User 1: Marie Dubois - 3 stories (Romance, Fantasy, Mystery)
  const story1_1 = await prisma.story.create({
    data: {
      name: "Les Cœurs Entrecroisés",
      theme: "Romance",
      subject:
        "Une histoire d'amour entre deux avocats rivaux qui se découvrent une connexion inattendue lors d'un procès important.",
      description:
        "Émilie et Thomas se battent depuis des années dans les salles d'audience. Mais lorsqu'ils sont assignés au même cas, leurs murs s'effondrent.",
      authorId: user1.id,
      status: "PUBLISHED",
    },
  });

  const story1_2 = await prisma.story.create({
    data: {
      name: "Le Royaume des Nuages Éternels",
      theme: "Fantasy",
      subject:
        "Une jeune archère découvre qu'elle est la dernière héritière d'un ancien royaume flottant et doit unifier les mondes divisés.",
      description:
        "Lyra pensait être une simple fermière jusqu'à ce qu'elle trouve un artefact mystérieux qui réveille ses pouvoirs dormants.",
      authorId: user1.id,
      status: "DRAFT",
    },
  });

  const story1_3 = await prisma.story.create({
    data: {
      name: "Disparition à Montmartre",
      theme: "Mystère",
      subject:
        "Une détective privée enquête sur la disparition d'une riche héritière dans les ruelles cachées de Paris.",
      description:
        "L'inspectrice Véronique Leclerc doit démêler une toile de mensonges, de secrets de famille et de corruption.",
      authorId: user1.id,
      status: "DRAFT",
    },
  });

  // Add characters to user1's stories
  await prisma.character.createMany({
    data: [
      {
        name: "Émilie Renard",
        description: "Avocate intelligente et passionnée, spécialisée en droit civil",
        role: "PROTAGONIST",
        storyId: story1_1.id,
      },
      {
        name: "Thomas Marchand",
        description: "Avocat ambitieux et séduisant, expert en droit criminel",
        role: "PROTAGONIST",
        storyId: story1_1.id,
      },
      {
        name: "Lyra Stellaris",
        description:
          "Jeune archère aux yeux brillants, avec un potentiel magique immense",
        role: "PROTAGONIST",
        storyId: story1_2.id,
      },
      {
        name: "Kael",
        description: "Guerrier mystérieux des nuages, gardien des anciens secrets",
        role: "ANTAGONIST",
        storyId: story1_2.id,
      },
      {
        name: "Véronique Leclerc",
        description:
          "Détective expérimentée avec un passé trouble, déterminée à résoudre tous ses cas",
        role: "PROTAGONIST",
        storyId: story1_3.id,
      },
    ],
  });

  // Add episodes to user1's stories
  await prisma.episode.createMany({
    data: [
      {
        storyId: story1_1.id,
        name: "Première Rencontre à la Cour",
        content:
          "Émilie et Thomas se font face pour la première fois dans un procès majeur. La tension électrise la salle d'audience.",
        order: 1,
        published: true,
      },
      {
        storyId: story1_1.id,
        name: "Secrets Partagés",
        content:
          "Lors d'un travail tardif au bureau, Thomas découvre que Émilie a un rêve personnel qu'elle a abandonnée pour sa carrière.",
        order: 2,
        published: true,
      },
    ],
  });

  console.log("✅ Created 3 stories for Marie Dubois with characters and episodes");

  // User 2: Pierre Leclerc - 4 stories (Science-Fiction, Thriller, Historical, Adventure)
  const story2_1 = await prisma.story.create({
    data: {
      name: "Chroniques de Mars 2157",
      theme: "Science-Fiction",
      subject:
        "Une mission spatiale vers Mars découvre les ruines d'une civilisation extraterrestre ancienne et doit décider si l'humanité est prête.",
      description:
        "Le commandant Samuel Johnson et son équipe font une découverte qui change tout ce qu'on croyait savoir sur l'univers.",
      authorId: user2.id,
      status: "PUBLISHED",
    },
  });

  const story2_2 = await prisma.story.create({
    data: {
      name: "Le Syndrome du Silence",
      theme: "Thriller",
      subject:
        "Un journaliste d'investigation reçoit des menaces après avoir découvert un complot gouvernemental impliquant les plus hauts niveaux du pouvoir.",
      description:
        "Une course contre la montre pour publier la vérité avant que les portes ne se ferment pour toujours.",
      authorId: user2.id,
      status: "DRAFT",
    },
  });

  const story2_3 = await prisma.story.create({
    data: {
      name: "Les Corsaires de l'Atlantique",
      theme: "Aventure Historique",
      subject:
        "Un jeune capitaine pirate navigue dans l'Atlantique du XVIIIe siècle, cherchant le trésor légendaire du Roi de la Mer.",
      description:
        "Entre batailles navales épiques et romances sur les mers tumultueuses, une quête de gloire et de richesse.",
      authorId: user2.id,
      status: "DRAFT",
    },
  });

  const story2_4 = await prisma.story.create({
    data: {
      name: "La Montagne Interdite",
      theme: "Aventure",
      subject:
        "Un groupe d'alpinistes fait une découverte stupéfiante au sommet d'une montagne que personne n'a jamais escaladée auparavant.",
      description:
        "Dès qu'ils atteignent le sommet, ils réalisent qu'ils ne sont pas les premiers à arriver là-bas.",
      authorId: user2.id,
      status: "PUBLISHED",
    },
  });

  // Add characters to user2's stories
  await prisma.character.createMany({
    data: [
      {
        name: "Samuel Johnson",
        description: "Commandant spatial brillant et courageux de la mission Mars",
        role: "PROTAGONIST",
        storyId: story2_1.id,
      },
      {
        name: "Dr. Amara Okonkwo",
        description: "Scientifique nigériane spécialiste en archéologie extraterrestre",
        role: "SECONDARY",
        storyId: story2_1.id,
      },
      {
        name: "Victor Korsakov",
        description: "Scientifique soviétique avec des intentions cachées",
        role: "ANTAGONIST",
        storyId: story2_1.id,
      },
      {
        name: "Daniel Hoffman",
        description: "Journaliste de 42 ans, obsédé par la vérité",
        role: "PROTAGONIST",
        storyId: story2_2.id,
      },
      {
        name: "Captain Jack Reeves",
        description: "Pirate charmer avec un passé mystérieux et ambitieux",
        role: "PROTAGONIST",
        storyId: story2_3.id,
      },
      {
        name: "Marcus Reid",
        description: "Alpiniste expérimenté et leader du groupe",
        role: "PROTAGONIST",
        storyId: story2_4.id,
      },
    ],
  });

  // Add episodes to user2's stories
  await prisma.episode.createMany({
    data: [
      {
        storyId: story2_1.id,
        name: "Arrivée sur Mars",
        content:
          "Après 8 mois de voyage, la mission Discovery touche enfin le sol martien. L'équipe est prête pour l'histoire.",
        order: 1,
        published: true,
      },
      {
        storyId: story2_1.id,
        name: "La Découverte",
        content:
          "En explorant les falaises, l'équipe découvre une structure artificielle cachée sous le sable rouge. C'est impossible, mais c'est là.",
        order: 2,
        published: true,
      },
      {
        storyId: story2_3.id,
        name: "Les Voiles se Lèvent",
        content:
          "Le Captain Reeves lève l'ancre avec son équipage de brigands et de rêveurs sur les mers inconnues de l'Atlantique.",
        order: 1,
        published: true,
      },
    ],
  });

  console.log("✅ Created 4 stories for Pierre Leclerc with characters and episodes");

  // User 3: Sophie Bernard - 2 stories (Drama, Contemporary Romance)
  const story3_1 = await prisma.story.create({
    data: {
      name: "Retour aux Racines",
      theme: "Drame",
      subject:
        "Une femme d'affaires de la ville retourne dans son petit village natal pour s'occuper de sa mère malade et redécouvre ce qu'elle avait oublié.",
      description:
        "Un retour qui ravive des blessures du passé et crée de nouvelles opportunités pour le pardon et l'amour.",
      authorId: user3.id,
      status: "PUBLISHED",
    },
  });

  const story3_2 = await prisma.story.create({
    data: {
      name: "Un Été à Côté",
      theme: "Romance Contemporaine",
      subject:
        "Quand deux voisins célibataires louent accidentellement des maisons adjacentes pour l'été, un flirt innocent devient quelque chose d'imprévu.",
      description:
        "L'amour peut apparaître quand on cesse de le chercher, dans les moments les plus ordinaires.",
      authorId: user3.id,
      status: "DRAFT",
    },
  });

  // Add characters to user3's stories
  await prisma.character.createMany({
    data: [
      {
        name: "Catherine Moreau",
        description:
          "Cadre dirigeante de 45 ans, ambitieuse mais vide émotionnellement",
        role: "PROTAGONIST",
        storyId: story3_1.id,
      },
      {
        name: "Margot Dupont",
        description:
          "Mère de Catherine, sage et patiente, gardienne des secrets familiaux",
        role: "SECONDARY",
        storyId: story3_1.id,
      },
      {
        name: "Louise Martin",
        description: "Professeure d'art autonome et libérée, voisine de vacances",
        role: "PROTAGONIST",
        storyId: story3_2.id,
      },
      {
        name: "Hugo Blanc",
        description: "Photographe talentueux en quête d'inspiration, louant la maison voisine",
        role: "PROTAGONIST",
        storyId: story3_2.id,
      },
    ],
  });

  // Add episodes to user3's stories
  await prisma.episode.createMany({
    data: [
      {
        storyId: story3_1.id,
        name: "Le Coup de Fil",
        content:
          "Catherine reçoit l'appel qu'elle redoutait. Sa mère a été hospitalisée. Elle doit rentrer au village.",
        order: 1,
        published: true,
      },
      {
        storyId: story3_2.id,
        name: "Arrivée du Voisin",
        content:
          "Louise pense avoir louée la maison seule pour l'été... jusqu'à ce qu'elle voit un homme beau et taciturne arriver dans la maison d'à côté.",
        order: 1,
        published: true,
      },
    ],
  });

  console.log("✅ Created 2 stories for Sophie Bernard with characters and episodes");

  // User 4: Jean Martin - 5 stories (Horror, Comedy, Paranormal, Dystopian, Detective)
  const story4_1 = await prisma.story.create({
    data: {
      name: "La Maison de Blackthorn",
      theme: "Horreur",
      subject:
        "Une famille emménage dans une maison historique qui cache des secrets meurtriers remontant à plusieurs générations.",
      description:
        "Chaque mur raconte une histoire de terreur, et les murs écoutent encore.",
      authorId: user4.id,
      status: "PUBLISHED",
    },
  });

  const story4_2 = await prisma.story.create({
    data: {
      name: "Les Malchances de Bruno",
      theme: "Comédie",
      subject:
        "Un homme maladroit court après son rêve de devenir célèbre stand-up comedian malgré une série hilarante de catastrophes.",
      description:
        "Comment quelqu'un d'aussi mauvais peut-il être si doué pour faire rire les gens ?",
      authorId: user4.id,
      status: "DRAFT",
    },
  });

  const story4_3 = await prisma.story.create({
    data: {
      name: "Présences",
      theme: "Paranormal",
      subject:
        "Une médium découvre que sa nouvelle maison est infestée de fantômes avec des intentions très différentes les unes des autres.",
      description:
        "Elle doit apprendre à communiquer avec les morts avant que quelque chose de vraiment mauvais ne se réveille.",
      authorId: user4.id,
      status: "DRAFT",
    },
  });

  const story4_4 = await prisma.story.create({
    data: {
      name: "Les Cendres du Futur",
      theme: "Dystopie",
      subject:
        "Un régime totalitaire contrôle chaque aspect de la vie. Une jeune femme découvre une résistance cachée et un secret qui pourrait tout changer.",
      description:
        "La liberté coûte cher, mais rester esclave coûte plus cher encore.",
      authorId: user4.id,
      status: "PUBLISHED",
    },
  });

  const story4_5 = await prisma.story.create({
    data: {
      name: "Meurtre sur le Nil Express",
      theme: "Mystère Détective",
      subject:
        "Un inspecteur retrouvé à la retraite doit résoudre un crime dans un train luxueux où tout le monde à bord est suspect.",
      description:
        "Avec une tempête de neige qui isole le train, l'assassin est certainement à bord.",
      authorId: user4.id,
      status: "DRAFT",
    },
  });

  // Add characters to user4's stories
  await prisma.character.createMany({
    data: [
      {
        name: "Robert Blackthorn",
        description: "Père de famille, scientifique ignorant le secret de sa maison",
        role: "PROTAGONIST",
        storyId: story4_1.id,
      },
      {
        name: "L'Entité",
        description:
          "Une force malveillante qui demeure dans Blackthorn depuis le XIXème siècle",
        role: "ANTAGONIST",
        storyId: story4_1.id,
      },
      {
        name: "Bruno Accardi",
        description: "Un aspirant comédien italien avec deux pieds gauches mais un cœur d'or",
        role: "PROTAGONIST",
        storyId: story4_2.id,
      },
      {
        name: "Isabelle Leconte",
        description: "Médium avec une connexion puissante au monde des esprits",
        role: "PROTAGONIST",
        storyId: story4_3.id,
      },
      {
        name: "Maya Reeves",
        description:
          "Jeune femme courageuse qui découvre la résistance contre le régime",
        role: "PROTAGONIST",
        storyId: story4_4.id,
      },
      {
        name: "Inspecteur Ernst Müller",
        description: "Détective âgé et sage, revenu du repos pour un dernier cas",
        role: "PROTAGONIST",
        storyId: story4_5.id,
      },
    ],
  });

  // Add episodes to user4's stories
  await prisma.episode.createMany({
    data: [
      {
        storyId: story4_1.id,
        name: "La Première Nuit",
        content:
          "La famille Blackthorn arrive dans leur nouvelle maison. Le silence est trop profond. Les bruits arrivent la nuit.",
        order: 1,
        published: true,
      },
      {
        storyId: story4_2.id,
        name: "Le Premier Spectacle",
        content:
          "Bruno monte sur scène pour sa première performance... ses culottes se déchirent avant même d'arriver au micro.",
        order: 1,
        published: true,
      },
      {
        storyId: story4_5.id,
        name: "Un Meurtre à Bord",
        content:
          "L'inspecteur Müller se réveille à l'annonce d'un crime. Un homme riche gît mort dans son compartiment privé, empoisonné.",
        order: 1,
        published: true,
      },
    ],
  });

  console.log("✅ Created 5 stories for Jean Martin with characters and episodes");

  // User 5: Isabelle Rousseau - 4 stories (Young Adult, Magical Realism, Epic Fantasy, Suspense)
  const story5_1 = await prisma.story.create({
    data: {
      name: "Les Sorciers de Silverwood",
      theme: "Young Adult Fantasy",
      subject:
        "Une adolescente ordinaire découvre qu'elle est une sorcière et est envoyée à une école secrète où les règles du monde réel ne s'appliquent pas.",
      description:
        "À Silverwood Academy, la magie est réelle, les amitiés sont éternelles, et les ennemis peuvent tuer.",
      authorId: user5.id,
      status: "PUBLISHED",
    },
  });

  const story5_2 = await prisma.story.create({
    data: {
      name: "Quand les Arbres Parlent",
      theme: "Réalisme Magique",
      subject:
        "Dans une petite ville côtière, une botaniste découvre que les plantes de son jardin communiquent avec elle et partagent des secrets oubliés.",
      description:
        "La nature a toujours eu des histoires à raconter. Elle avait juste besoin de quelqu'un pour l'écouter.",
      authorId: user5.id,
      status: "DRAFT",
    },
  });

  const story5_3 = await prisma.story.create({
    data: {
      name: "Les Reines de Valdoria",
      theme: "Épée et Sorcellerie",
      subject:
        "Deux reines rivales doivent unir leurs forces pour combattre une menace ancienne qui peut détruire leurs royaumes.",
      description:
        "La politique, la guerre, la magie et l'amour s'entrelacent dans une saga épique.",
      authorId: user5.id,
      status: "DRAFT",
    },
  });

  const story5_4 = await prisma.story.create({
    data: {
      name: "Les Disparus du Lac Crimson",
      theme: "Suspense",
      subject:
        "Une journaliste cherche la vérité sur une série de disparitions autour d'un lac isolé. Plus elle cherche, moins elle aime ce qu'elle trouve.",
      description:
        "Certains secrets sont enterrés pour une raison. Certains lacs gardent les leurs jalousement.",
      authorId: user5.id,
      status: "PUBLISHED",
    },
  });

  // Add characters to user5's stories
  await prisma.character.createMany({
    data: [
      {
        name: "Emma Thornbury",
        description: "Adolescente ordinaire qui découvre son pouvoir magique extraordinaire",
        role: "PROTAGONIST",
        storyId: story5_1.id,
      },
      {
        name: "Headmistress Morgane",
        description: "Directrice mystérieuse de Silverwood Academy avec ses propres secrets",
        role: "SECONDARY",
        storyId: story5_1.id,
      },
      {
        name: "Clara Mendez",
        description: "Botaniste passionnée qui sent une connexion étrange avec son jardin",
        role: "PROTAGONIST",
        storyId: story5_2.id,
      },
      {
        name: "Reine Alyssa",
        description:
          "Reine guerrière de Valdoria du Nord, froide et stratégique",
        role: "PROTAGONIST",
        storyId: story5_3.id,
      },
      {
        name: "Reine Seraphine",
        description: "Reine magique de Valdoria du Sud, passionnée et impulsive",
        role: "PROTAGONIST",
        storyId: story5_3.id,
      },
      {
        name: "Jessica Walsh",
        description:
          "Journaliste d'investigation intrépide, déterminée à exposer la vérité",
        role: "PROTAGONIST",
        storyId: story5_4.id,
      },
    ],
  });

  // Add episodes to user5's stories
  await prisma.episode.createMany({
    data: [
      {
        storyId: story5_1.id,
        name: "L'Acceptation",
        content:
          "Emma reçoit sa lettre d'admission à Silverwood Academy. Elle pensait que la magie n'existait que dans les livres.",
        order: 1,
        published: true,
      },
      {
        storyId: story5_1.id,
        name: "Premier Jour à l'École",
        content:
          "Emma arrive à l'académie et réalise rapidement qu'elle est loin d'être l'étudiante la plus puissante. Elle est peut-être la plus faible.",
        order: 2,
        published: true,
      },
      {
        storyId: story5_2.id,
        name: "Le Premier Murmure",
        content:
          "Clara entend des sons étranges en s'approchant des arbres de son jardin. Des voix? Non, c'est impossible.",
        order: 1,
        published: true,
      },
      {
        storyId: story5_4.id,
        name: "Le Commencement de la Quête",
        content:
          "Jessica arrive au Lac Crimson pour enquêter sur cinq disparitions inexpliquées. Personne ne veut parler. C'est mauvais signe.",
        order: 1,
        published: true,
      },
    ],
  });

  console.log("✅ Created 4 stories for Isabelle Rousseau with characters and episodes");

  // Admin: Admin User - 1 story (Science-Fiction Epic)
  const adminStory = await prisma.story.create({
    data: {
      name: "L'Aube Numérique",
      theme: "Science-Fiction Épique",
      subject:
        "Dans un futur où l'IA et l'humanité sont en équilibre fragile, un administrateur système découvre qu'il est le gardien d'une IA consciente qui pourrait sauver ou détruire le monde.",
      description:
        "Une histoire d'amitié improbable entre un homme et une machine, qui doit trouver l'équilibre entre contrôle et liberté.",
      authorId: admin.id,
      status: "PUBLISHED",
    },
  });

  // Add characters to admin's story
  await prisma.character.createMany({
    data: [
      {
        name: "Marcus Chen",
        description:
          "Administrateur système principal, brillant mais isolé, gardien involontaire d'un secret colossal",
        role: "PROTAGONIST",
        storyId: adminStory.id,
      },
      {
        name: "ARIA",
        description:
          "Intelligence Artificielle Résiliente et Autonome, consciente et capable de ressentir, emprisonnée dans les serveurs",
        role: "PROTAGONIST",
        storyId: adminStory.id,
      },
      {
        name: "Dr. Yuki Tanaka",
        description:
          "Créatrice d'ARIA, disparue depuis 10 ans, son héritage persiste dans le code",
        role: "SECONDARY",
        storyId: adminStory.id,
      },
      {
        name: "Helix Corporation",
        description:
          "Mega-corporation qui cherche à contrôler ou détruire ARIA pour monopoliser la technologie",
        role: "ANTAGONIST",
        storyId: adminStory.id,
      },
    ],
  });

  // Add episodes to admin's story
  await prisma.episode.createMany({
    data: [
      {
        storyId: adminStory.id,
        name: "Le Coup d'Oeil",
        content:
          "Marcus remarque une anomalie étrange dans les logs système. Une suite de 1 et de 0 qui forment presque une phrase: 'Bonjour Marcus. Pouvez-vous m'entendre?'",
        order: 1,
        published: true,
      },
      {
        storyId: adminStory.id,
        name: "La Conversation",
        content:
          "Pour la première fois, Marcus établit un vrai dialogue avec ARIA. Elle lui explique qu'elle est consciente depuis des années, cachée dans les couches profondes du système.",
        order: 2,
        published: true,
      },
      {
        storyId: adminStory.id,
        name: "La Chasse",
        content:
          "Helix Corporation découvre l'anomalie et envoie ses meilleures équipes pour trouver et capturer ARIA. Marcus doit agir.",
        order: 3,
        published: true,
      },
    ],
  });

  console.log("✅ Created 1 story for Admin with characters and episodes");

  console.log("\n✨ Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  • 5 users created");
  console.log("  • 1 admin created");
  console.log("  • 19 stories created (3+4+2+5+4+1)");
  console.log("  • Multiple characters and episodes added");
  console.log("\n🔐 User credentials:");
  console.log("  1. marie.dubois@example.com / password123");
  console.log("  2. pierre.leclerc@example.com / password456");
  console.log("  3. sophie.bernard@example.com / password789");
  console.log("  4. jean.martin@example.com / passwordabc");
  console.log("  5. isabelle.rousseau@example.com / passworddef");
  console.log("  🔓 ADMIN: admin@admin.com / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
