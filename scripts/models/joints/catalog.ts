// The structures of the joints model, in anatomy-panel order. `sources` names
// Z-Anatomy objects without their side suffix: both sides of a paired object
// become one structure, as in the muscles and vessels explorers. `bones` names
// SkeletalSystem100 groups whose bones are merged into one context structure.

export type Kind =
  "ligament" | "capsule" | "fibrocartilage" | "membrane" | "fat" | "bone"

export type Entry = {
  id: string
  label: string
  group: string
  kind: Kind
  description: string
  sources?: string[]
  bones?: string[]
}

const groups: [string, [string, Kind, string, string[]?][]][] = [
  [
    "Jaw and skull base",
    [
      [
        "Articular capsule of temporomandibular joint",
        "capsule",
        "The loose fibrous sleeve around the jaw joint, attached to the temporal bone and the neck of the mandible.",
      ],
      [
        "Articular disc of temporomandibular joint",
        "fibrocartilage",
        "A fibrous plate dividing the jaw joint into upper and lower compartments, so the condyle can both glide and hinge.",
      ],
      [
        "Lateral temporomandibular ligament",
        "ligament",
        "The thickened outer wall of the jaw joint capsule. It stops the condyle from sliding too far back or down.",
      ],
      [
        "Sphenomandibular ligament",
        "ligament",
        "A thin band from the sphenoid spine to the lingula of the mandible, inside the jaw joint.",
      ],
      [
        "Stylomandibular ligament",
        "ligament",
        "A band from the styloid process to the angle of the mandible that limits forward movement of the jaw.",
      ],
      [
        "Pterygospinous ligament",
        "ligament",
        "A small band between the lateral pterygoid plate and the sphenoid spine. It sometimes ossifies.",
      ],
      [
        "Stylohyoid ligament",
        "ligament",
        "A fibrous cord from the tip of the styloid process to the lesser horn of the hyoid bone.",
      ],
    ],
  ],
  [
    "Larynx",
    [
      [
        "Median thyrohyoid ligament",
        "ligament",
        "The thick middle part of the thyrohyoid membrane, joining the thyroid cartilage to the hyoid bone.",
      ],
      [
        "Lateral thyrohyoid ligament",
        "ligament",
        "The rounded back edge of the thyrohyoid membrane, from the superior horn of the thyroid cartilage to the hyoid.",
      ],
      [
        "Quadrangular membrane",
        "membrane",
        "A sheet of connective tissue from the epiglottis to the arytenoid cartilage. Its lower edge forms the vestibular fold.",
      ],
      [
        "Median cricothyroid ligament",
        "ligament",
        "The membrane between the thyroid and cricoid cartilages at the front of the neck, the site of an emergency cricothyrotomy.",
      ],
      [
        "Cricopharyngeal ligament",
        "ligament",
        "A band from the corniculate cartilages to the back of the cricoid lamina, near the crico-arytenoid joint.",
      ],
    ],
  ],
  [
    "Vertebral column",
    [
      [
        "Anterior longitudinal ligament",
        "ligament",
        "A broad band down the front of the vertebral bodies and discs from the skull to the sacrum. It limits bending backward.",
      ],
      [
        "Posterior longitudinal ligament",
        "ligament",
        "A band down the backs of the vertebral bodies, inside the vertebral canal. It limits bending forward.",
      ],
      [
        "Ligamenta flava",
        "ligament",
        "Elastic yellow ligaments joining the laminae of neighbouring vertebrae. They help straighten the spine after bending.",
      ],
      [
        "Interspinous ligaments",
        "ligament",
        "Thin sheets joining neighbouring spinous processes.",
      ],
      [
        "Supraspinous ligament",
        "ligament",
        "A strong cord along the tips of the spinous processes from C7 to the sacrum.",
      ],
      [
        "Nuchal ligament",
        "ligament",
        "The upward continuation of the supraspinous ligament in the neck, from C7 to the occipital bone. It anchors neck muscles.",
      ],
      [
        "Intertransverse ligaments",
        "ligament",
        "Thin bands between neighbouring transverse processes, most developed in the lumbar spine.",
      ],
      [
        "Intercornual ligament",
        "ligament",
        "Joins the cornua of the sacrum and coccyx at the sacrococcygeal joint.",
      ],
      [
        "Sacrococcygeal symphysis",
        "fibrocartilage",
        "The fibrocartilaginous joint between the sacrum and the coccyx.",
      ],
    ],
  ],
  [
    "Thorax",
    [
      [
        "Radiate ligament of head of rib",
        "ligament",
        "A fan-shaped band from the head of a rib to the two vertebral bodies and the disc it meets.",
      ],
      [
        "Intra-articular ligament of head of rib",
        "ligament",
        "A short band inside the joint of the head of a rib, from the crest of the head to the intervertebral disc.",
      ],
      [
        "Costotransverse ligament",
        "ligament",
        "Joins the neck of a rib to the transverse process of its vertebra.",
      ],
      [
        "External intercostal membrane",
        "membrane",
        "The thin sheet that replaces the external intercostal muscles near the sternum, between the costal cartilages.",
      ],
      [
        "Internal intercostal membrane",
        "membrane",
        "The thin sheet that replaces the internal intercostal muscles near the spine, between the ribs.",
      ],
    ],
  ],
  [
    "Shoulder girdle",
    [
      [
        "Articular capsule of sternoclavicular joint",
        "capsule",
        "The fibrous capsule of the joint between the clavicle and the manubrium, the only bony joint between arm and trunk.",
      ],
      [
        "Articular disc of sternoclavicular joint",
        "fibrocartilage",
        "A disc dividing the sternoclavicular joint in two. It absorbs force passed along the clavicle.",
      ],
      [
        "Anterior sternoclavicular ligament",
        "ligament",
        "Reinforces the front of the sternoclavicular joint.",
      ],
      [
        "Posterior sternoclavicular ligament",
        "ligament",
        "Reinforces the back of the sternoclavicular joint.",
      ],
      [
        "Interclavicular ligament",
        "ligament",
        "Joins the inner ends of the two clavicles across the top of the manubrium.",
      ],
      [
        "Costoclavicular ligament",
        "ligament",
        "A strong band from the first rib to the underside of the clavicle that limits elevation of the shoulder.",
      ],
      [
        "Articular capsule of acromioclavicular joint",
        "capsule",
        "The fibrous capsule of the joint between the clavicle and the acromion of the scapula.",
      ],
      [
        "Articular disc of acromioclavicular joint",
        "fibrocartilage",
        "An often incomplete disc inside the acromioclavicular joint.",
      ],
      [
        "Acromioclavicular ligament",
        "ligament",
        "Strengthens the top of the acromioclavicular joint capsule.",
      ],
      [
        "Conoid ligament",
        "ligament",
        "The cone-shaped inner part of the coracoclavicular ligament, from the coracoid process to the conoid tubercle of the clavicle.",
      ],
      [
        "Trapezoid ligament",
        "ligament",
        "The flat outer part of the coracoclavicular ligament. With the conoid ligament it suspends the scapula from the clavicle.",
      ],
      [
        "Coraco-acromial ligament",
        "ligament",
        "Spans the coracoid process and the acromion, forming a roof over the shoulder joint.",
      ],
      [
        "Superior transverse scapular ligament",
        "ligament",
        "Bridges the suprascapular notch. The suprascapular nerve passes beneath it.",
      ],
      [
        "Inferior transverse scapular ligament",
        "ligament",
        "Bridges the spinoglenoid notch at the base of the spine of the scapula.",
      ],
    ],
  ],
  [
    "Shoulder",
    [
      [
        "Articular capsule of glenohumeral joint",
        "capsule",
        "The loose capsule of the shoulder joint, which allows its wide range of movement.",
      ],
      [
        "Glenoid labrum",
        "fibrocartilage",
        "A fibrocartilage rim that deepens the shallow glenoid cavity of the scapula.",
      ],
      [
        "Superior glenohumeral ligament",
        "ligament",
        "A thickening of the upper front of the shoulder capsule.",
      ],
      [
        "Middle glenohumeral ligament",
        "ligament",
        "A thickening of the front of the shoulder capsule that limits outward rotation.",
      ],
      [
        "Inferior glenohumeral ligament",
        "ligament",
        "The strongest glenohumeral ligament. It steadies the raised, outward-rotated arm against dislocation.",
      ],
      [
        "Coracohumeral ligament",
        "ligament",
        "A broad band from the coracoid process to the greater tubercle of the humerus, over the top of the joint.",
      ],
      [
        "Transverse humeral ligament",
        "ligament",
        "Bridges the intertubercular groove and holds the long tendon of biceps in place.",
      ],
    ],
  ],
  [
    "Elbow and forearm",
    [
      [
        "Articular capsule of elbow joint",
        "capsule",
        "The capsule enclosing the humero-ulnar, humeroradial and proximal radio-ulnar joints.",
      ],
      [
        "Ulnar collateral ligament",
        "ligament",
        "A triangular band on the inner side of the elbow that resists sideways force opening the joint.",
      ],
      [
        "Radial collateral ligament",
        "ligament",
        "A fan-shaped band on the outer side of the elbow, blending with the annular ligament.",
      ],
      [
        "Annular ligament of radius",
        "ligament",
        "A ring around the head of the radius that holds it against the ulna while it turns.",
      ],
      [
        "Quadrate ligament",
        "ligament",
        "A short band from the radial notch of the ulna to the neck of the radius.",
      ],
      [
        "Interosseous membrane of forearm",
        "membrane",
        "A fibrous sheet joining the radius and ulna. It passes force from the radius to the ulna and anchors forearm muscles.",
      ],
      [
        "Oblique cord",
        "ligament",
        "A small band from the ulnar tuberosity to the radius, above the interosseous membrane.",
      ],
    ],
  ],
  [
    "Wrist",
    [
      [
        "Articular disc of distal radio-ulnar joint",
        "fibrocartilage",
        "The triangular fibrocartilage between the ulna and the carpal bones.",
      ],
      [
        "Palmar radio-ulnar ligament",
        "ligament",
        "Reinforces the front of the distal radio-ulnar joint.",
      ],
      [
        "Dorsal radio-ulnar ligament",
        "ligament",
        "Reinforces the back of the distal radio-ulnar joint.",
      ],
      [
        "Articular capsule of radiocarpal joint",
        "capsule",
        "The capsule of the wrist joint between the radius and the first row of carpal bones.",
      ],
      [
        "Radial collateral ligament of wrist joint",
        "ligament",
        "Runs from the radial styloid to the scaphoid on the thumb side of the wrist.",
      ],
      [
        "Ulnar collateral ligament of wrist joint",
        "ligament",
        "Runs from the ulnar styloid to the triquetrum and pisiform on the little-finger side of the wrist.",
      ],
      [
        "Dorsal radiocarpal ligament",
        "ligament",
        "Runs obliquely from the back of the radius to the carpal bones.",
      ],
      [
        "Radioscaphocapitate ligament",
        "ligament",
        "A palmar band from the radius across the scaphoid to the capitate.",
      ],
      [
        "Radiocapitate ligament",
        "ligament",
        "A palmar band from the radius to the capitate.",
      ],
      [
        "Ulnolunate ligament",
        "ligament",
        "A palmar band from the triangular fibrocartilage to the lunate.",
      ],
      [
        "Ulnotriquetral ligament",
        "ligament",
        "A palmar band from the triangular fibrocartilage to the triquetrum.",
      ],
      [
        "Ulnocapitate ligament",
        "ligament",
        "A palmar band from the ulnar head to the capitate.",
      ],
      [
        "Ulnopisiform ligament",
        "ligament",
        "A small band from the ulnar side of the wrist to the pisiform.",
      ],
      [
        "Dorsal ulnocarpal ligament",
        "ligament",
        "A band on the back of the wrist from the ulnar side to the carpal bones.",
      ],
      [
        "Radiate carpal ligament",
        "ligament",
        "Fibres radiating from the palmar side of the capitate to the surrounding carpal bones.",
      ],
      [
        "Dorsal intercarpal ligaments",
        "ligament",
        "Bands joining the carpal bones across the back of the wrist.",
      ],
      [
        "Dorsal scaphotriquetral ligament",
        "ligament",
        "Part of the dorsal intercarpal ligament from the scaphoid to the triquetrum.",
      ],
      [
        "Palmar scaphotriquetral ligament",
        "ligament",
        "A palmar band from the scaphoid to the triquetrum.",
      ],
      [
        "Scapholunate interosseous ligament",
        "ligament",
        "Joins the scaphoid and lunate. Its tear is the most common cause of carpal instability.",
      ],
      [
        "Lunotriquetral interosseous ligament",
        "ligament",
        "Joins the lunate and triquetrum.",
      ],
      [
        "Palmar lunotriquetral ligament",
        "ligament",
        "Joins the palmar surfaces of the lunate and triquetrum.",
      ],
      [
        "Scaphocapitate ligament",
        "ligament",
        "A palmar band from the scaphoid to the capitate.",
      ],
      [
        "Triquetrocapitate ligament",
        "ligament",
        "A palmar band from the triquetrum to the capitate.",
      ],
      [
        "Triquetrohamate ligament",
        "ligament",
        "Joins the triquetrum and hamate.",
      ],
      [
        "Scaphotrapeziotrapezoidal ligament",
        "ligament",
        "Joins the scaphoid to the trapezium and trapezoid at the base of the thumb.",
      ],
      [
        "Trapeziotrapezoidal interosseous ligament",
        "ligament",
        "Joins the trapezium and trapezoid.",
      ],
      [
        "Trapezoideocapitate interosseous ligament",
        "ligament",
        "Joins the trapezoid and capitate inside their joint.",
      ],
      [
        "Palmar trapezoideocapitate ligament",
        "ligament",
        "Joins the palmar surfaces of the trapezoid and capitate.",
      ],
      [
        "Capitohamate interosseous ligament",
        "ligament",
        "Joins the capitate and hamate inside their joint.",
      ],
      [
        "Palmar capitohamate ligament",
        "ligament",
        "Joins the palmar surfaces of the capitate and hamate.",
      ],
      [
        "Pisotriquetral ligament",
        "ligament",
        "Holds the pisiform against the triquetrum.",
      ],
      [
        "Pisohamate ligament",
        "ligament",
        "Continues the pull of flexor carpi ulnaris from the pisiform to the hook of the hamate.",
      ],
      [
        "Pisometacarpal ligament",
        "ligament",
        "Continues the pull of flexor carpi ulnaris from the pisiform to the base of the fifth metacarpal.",
      ],
    ],
  ],
  [
    "Hand",
    [
      [
        "Palmar carpometacarpal ligaments",
        "ligament",
        "Join the distal carpal bones to the bases of the metacarpals on the palm side.",
      ],
      [
        "Dorsal carpometacarpal ligaments",
        "ligament",
        "Join the distal carpal bones to the bases of the metacarpals on the back of the hand.",
      ],
      [
        "Palmar metacarpal ligaments",
        "ligament",
        "Join the bases of neighbouring metacarpals on the palm side.",
      ],
      [
        "Dorsal metacarpal ligaments",
        "ligament",
        "Join the bases of neighbouring metacarpals on the back of the hand.",
      ],
      [
        "Interosseous metacarpal ligaments",
        "ligament",
        "Join the bases of neighbouring metacarpals between their joint surfaces.",
      ],
      [
        "Articular capsules of metacarpophalangeal joints",
        "capsule",
        "The capsules of the knuckle joints between the metacarpals and the proximal phalanges.",
      ],
      [
        "Collateral metacarpophalangeal ligaments",
        "ligament",
        "Strengthen the sides of the knuckle joints. They are tight when the fingers are bent.",
      ],
      [
        "Deep transverse metacarpal ligament",
        "ligament",
        "Joins the palmar plates of the second to fifth knuckle joints, holding the metacarpal heads together.",
      ],
      [
        "Articular capsules of proximal interphalangeal joints",
        "capsule",
        "The capsules of the middle finger joints.",
      ],
      [
        "Articular capsules of distal interphalangeal joints",
        "capsule",
        "The capsules of the finger joints nearest the fingertips.",
      ],
      [
        "Collateral interphalangeal ligaments of hand",
        "ligament",
        "Strengthen the sides of the finger joints and keep them moving as hinges.",
      ],
      [
        "Palmar interphalangeal ligaments",
        "ligament",
        "Thick palmar plates on the front of the finger joints that stop them bending backward.",
      ],
    ],
  ],
  [
    "Pelvis",
    [
      [
        "Anterior sacro-iliac ligament",
        "ligament",
        "A thin sheet across the front of the sacro-iliac joint.",
      ],
      [
        "Interosseous sacro-iliac ligament",
        "ligament",
        "Short, very strong fibres filling the gap between sacrum and ilium behind the joint, the main bond of the sacro-iliac joint.",
      ],
      [
        "Posterior sacro-iliac ligament",
        "ligament",
        "Bands from the back of the sacrum to the ilium that cover the interosseous ligament.",
      ],
      [
        "Iliolumbar ligament",
        "ligament",
        "Joins the transverse process of L5 to the iliac crest and anchors the lowest vertebra to the pelvis.",
      ],
      [
        "Sacrotuberous ligament",
        "ligament",
        "A long band from the sacrum and coccyx to the ischial tuberosity. It resists the sacrum tipping forward.",
      ],
      [
        "Sacrospinous ligament",
        "ligament",
        "A triangular band from the sacrum to the ischial spine. It divides the greater and lesser sciatic foramina.",
      ],
      [
        "Obturator membrane",
        "membrane",
        "A fibrous sheet closing the obturator foramen, leaving a gap above for the obturator vessels and nerve.",
      ],
      [
        "Pubic symphysis",
        "fibrocartilage",
        "The cartilaginous joint between the two pubic bones, built around the fibrocartilage interpubic disc.",
        ["Pubic_symphysis", "Interpubic_disc"],
      ],
      [
        "Superior pubic ligament",
        "ligament",
        "Runs along the top of the pubic symphysis between the pubic tubercles.",
      ],
      [
        "Inferior pubic ligament",
        "ligament",
        "An arched band along the lower edge of the pubic symphysis, rounding off the pubic arch.",
      ],
    ],
  ],
  [
    "Hip",
    [
      [
        "Articular capsule of hip joint",
        "capsule",
        "The strong capsule of the hip joint, from the rim of the acetabulum to the neck of the femur.",
      ],
      [
        "Acetabular labrum",
        "fibrocartilage",
        "A fibrocartilage rim that deepens the acetabulum and grips the head of the femur.",
      ],
      [
        "Transverse acetabular ligament",
        "ligament",
        "Bridges the acetabular notch, completing the ring of the labrum.",
      ],
      [
        "Ligament of head of femur",
        "ligament",
        "A flat band from the acetabular notch to the fovea of the femoral head. It carries a small artery to the head.",
      ],
      [
        "Descending part of iliofemoral ligament",
        "ligament",
        "The inner limb of the Y-shaped iliofemoral ligament, the strongest ligament in the body. It stops the hip extending too far.",
      ],
      [
        "Transverse part of iliofemoral ligament",
        "ligament",
        "The outer limb of the Y-shaped iliofemoral ligament, to the upper intertrochanteric line.",
      ],
      [
        "Pubofemoral ligament",
        "ligament",
        "Strengthens the front and underside of the hip capsule and limits spreading of the legs.",
      ],
      [
        "Ischiofemoral ligament",
        "ligament",
        "Spirals from the ischium over the back of the hip capsule and limits inward rotation.",
      ],
      [
        "Zona orbicularis",
        "ligament",
        "Circular fibres of the hip capsule that collar the neck of the femur.",
      ],
      [
        "Frenula capsulae",
        "capsule",
        "Folds of synovial membrane running along the neck of the femur inside the hip capsule.",
      ],
    ],
  ],
  [
    "Knee",
    [
      [
        "Articular capsule of knee joint",
        "capsule",
        "The thin fibrous capsule of the knee, reinforced by surrounding tendons and ligaments.",
      ],
      [
        "Anterior cruciate ligament",
        "ligament",
        "Crosses inside the knee from the front of the tibia to the lateral femoral condyle. It stops the tibia sliding forward.",
      ],
      [
        "Posterior cruciate ligament",
        "ligament",
        "Crosses inside the knee from the back of the tibia to the medial femoral condyle. It stops the tibia sliding backward.",
      ],
      [
        "Medial meniscus",
        "fibrocartilage",
        "A C-shaped fibrocartilage on the medial tibial plateau. It is fixed to the capsule, which makes it the meniscus most often torn.",
      ],
      [
        "Lateral meniscus",
        "fibrocartilage",
        "A nearly circular fibrocartilage on the lateral tibial plateau, more mobile than the medial meniscus.",
      ],
      [
        "Transverse ligament of knee",
        "ligament",
        "Joins the front edges of the two menisci.",
      ],
      [
        "Anterior meniscotibial ligament (medial meniscus)",
        "ligament",
        "Anchors the front horn of the medial meniscus to the tibia.",
      ],
      [
        "Posterior meniscotibial ligament (medial meniscus)",
        "ligament",
        "Anchors the back horn of the medial meniscus to the tibia.",
      ],
      [
        "Anterior meniscotibial ligament (lateral meniscus)",
        "ligament",
        "Anchors the front horn of the lateral meniscus to the tibia.",
      ],
      [
        "Posterior meniscotibial ligament (lateral meniscus)",
        "ligament",
        "Anchors the back horn of the lateral meniscus to the tibia.",
      ],
      [
        "Superficial part of tibial collateral ligament",
        "ligament",
        "The long outer layer of the medial collateral ligament, from the medial femoral epicondyle to the tibia. It resists the knee bending inward.",
      ],
      [
        "Deep part of tibial collateral ligament",
        "ligament",
        "The short inner layer of the medial collateral ligament, attached to the medial meniscus.",
      ],
      [
        "Fibular collateral ligament",
        "ligament",
        "A cord from the lateral femoral epicondyle to the head of the fibula. It resists the knee bending outward.",
      ],
      [
        "Oblique popliteal ligament",
        "ligament",
        "An expansion of the semimembranosus tendon across the back of the knee capsule.",
      ],
      [
        "Arcuate popliteal ligament",
        "ligament",
        "A Y-shaped band arching over the popliteus tendon at the back of the knee.",
      ],
      [
        "Popliteofibular ligament",
        "ligament",
        "Joins the popliteus tendon to the head of the fibula and steadies the back of the outer knee.",
      ],
      [
        "Meniscopatellar ligament",
        "ligament",
        "A band from the side of the patella to the meniscus.",
      ],
      [
        "Infrapatellar fat pad",
        "fat",
        "A pad of fat behind the patellar ligament, inside the capsule but outside the synovial cavity.",
      ],
      [
        "Articular capsule of superior tibiofibular joint",
        "capsule",
        "The capsule of the small joint between the head of the fibula and the lateral condyle of the tibia.",
      ],
      [
        "Anterior ligament of fibular head",
        "ligament",
        "Reinforces the front of the superior tibiofibular joint.",
      ],
      [
        "Posterior ligament of fibular head",
        "ligament",
        "Reinforces the back of the superior tibiofibular joint.",
      ],
    ],
  ],
  [
    "Leg and ankle",
    [
      [
        "Interosseous membrane of leg",
        "membrane",
        "A fibrous sheet joining the tibia and fibula that separates the front and back muscles of the leg.",
      ],
      [
        "Anterior tibiofibular ligament",
        "ligament",
        "Joins the lower ends of the tibia and fibula at the front of the ankle. It is injured in a high ankle sprain.",
      ],
      [
        "Posterior tibiofibular ligament",
        "ligament",
        "Joins the lower ends of the tibia and fibula at the back of the ankle.",
      ],
      [
        "Transverse tibiofibular ligament",
        "ligament",
        "The deep lower part of the posterior tibiofibular ligament, deepening the ankle socket from behind.",
      ],
      [
        "Anterior talofibular ligament",
        "ligament",
        "Joins the lateral malleolus to the talus. It is the ligament most often torn in an ankle sprain.",
      ],
      [
        "Calcaneofibular ligament",
        "ligament",
        "A cord from the tip of the lateral malleolus to the calcaneus.",
      ],
      [
        "Posterior talofibular ligament",
        "ligament",
        "The strongest of the lateral ankle ligaments, from the lateral malleolus to the back of the talus.",
      ],
      [
        "Tibionavicular ligament",
        "ligament",
        "The front part of the deltoid ligament, from the medial malleolus to the navicular.",
      ],
      [
        "Tibiocalcaneal ligament",
        "ligament",
        "The middle part of the deltoid ligament, from the medial malleolus to the sustentaculum tali of the calcaneus.",
      ],
      [
        "Posterior tibiotalar ligament",
        "ligament",
        "The back part of the deltoid ligament, from the medial malleolus to the talus.",
      ],
    ],
  ],
  [
    "Foot",
    [
      [
        "Talocalcaneal interosseous ligament",
        "ligament",
        "A strong band in the tarsal sinus joining the talus and calcaneus.",
      ],
      [
        "Anterior talocalcaneal ligament",
        "ligament",
        "Joins the neck of the talus to the calcaneus in front of the subtalar joint.",
      ],
      [
        "Lateral talocalcaneal ligament",
        "ligament",
        "Joins the outer sides of the talus and calcaneus.",
      ],
      [
        "Medial talocalcaneal ligament",
        "ligament",
        "Joins the inner sides of the talus and calcaneus.",
      ],
      [
        "Posterior talocalcaneal ligament",
        "ligament",
        "Joins the back of the talus to the calcaneus.",
      ],
      [
        "Talonavicular ligament",
        "ligament",
        "Joins the neck of the talus to the top of the navicular.",
      ],
      [
        "Plantar calcaneonavicular ligament",
        "ligament",
        "The spring ligament, from the sustentaculum tali to the navicular. It supports the head of the talus and the arch.",
      ],
      [
        "Calcaneonavicular ligament",
        "ligament",
        "The inner limb of the bifurcate ligament, from the calcaneus to the navicular.",
      ],
      [
        "Calcaneocuboid ligament",
        "ligament",
        "The outer limb of the bifurcate ligament, from the calcaneus to the cuboid.",
      ],
      [
        "Dorsal calcaneocuboid ligament",
        "ligament",
        "Joins the tops of the calcaneus and cuboid.",
      ],
      [
        "Plantar calcaneocuboid ligament",
        "ligament",
        "The short plantar ligament, a deep band from the calcaneus to the cuboid that supports the lateral arch.",
      ],
      [
        "Long plantar ligament",
        "ligament",
        "The longest ligament of the foot, from the calcaneus to the cuboid and the bases of the outer metatarsals.",
      ],
      [
        "Dorsal cuboideonavicular ligament",
        "ligament",
        "Joins the tops of the cuboid and navicular.",
      ],
      [
        "Plantar cuboideonavicular ligament",
        "ligament",
        "Joins the soles of the cuboid and navicular.",
      ],
      [
        "Dorsal cuneonavicular ligaments",
        "ligament",
        "Join the navicular to the three cuneiforms on the top of the foot.",
      ],
      [
        "Plantar cuneonavicular ligaments",
        "ligament",
        "Join the navicular to the three cuneiforms on the sole.",
      ],
      [
        "Dorsal intercuneiform ligaments",
        "ligament",
        "Join neighbouring cuneiforms on the top of the foot.",
      ],
      [
        "Plantar intercuneiform ligaments",
        "ligament",
        "Join neighbouring cuneiforms on the sole.",
      ],
      [
        "Intercuneiform interosseous ligaments",
        "ligament",
        "Join neighbouring cuneiforms between their joint surfaces.",
      ],
      [
        "Dorsal cuneocuboid ligament",
        "ligament",
        "Joins the lateral cuneiform and cuboid on the top of the foot.",
      ],
      [
        "Plantar cuneocuboid ligament",
        "ligament",
        "Joins the lateral cuneiform and cuboid on the sole.",
      ],
      [
        "Cuneocuboid interosseous ligament",
        "ligament",
        "Joins the lateral cuneiform and cuboid between their joint surfaces.",
      ],
      [
        "Dorsal tarsometatarsal ligaments",
        "ligament",
        "Join the cuneiforms and cuboid to the bases of the metatarsals on the top of the foot.",
      ],
      [
        "Plantar tarsometatarsal ligaments",
        "ligament",
        "Join the cuneiforms and cuboid to the bases of the metatarsals on the sole.",
      ],
      [
        "Cuneometatarsal interosseous ligaments",
        "ligament",
        "Includes the Lisfranc ligament, from the medial cuneiform to the base of the second metatarsal.",
      ],
      [
        "Dorsal metatarsal ligaments",
        "ligament",
        "Join the bases of neighbouring metatarsals on the top of the foot.",
      ],
      [
        "Plantar metatarsal ligaments",
        "ligament",
        "Join the bases of neighbouring metatarsals on the sole.",
      ],
      [
        "Metatarsal interosseous ligaments",
        "ligament",
        "Join the bases of neighbouring metatarsals between their joint surfaces.",
      ],
      [
        "Intersesamoid ligament",
        "ligament",
        "Joins the two sesamoid bones under the head of the first metatarsal.",
      ],
      [
        "Articular capsules of metatarsophalangeal joints",
        "capsule",
        "The capsules of the joints between the metatarsals and the proximal phalanges of the toes.",
      ],
      [
        "Collateral metatarsophalangeal ligaments",
        "ligament",
        "Strengthen the sides of the metatarsophalangeal joints.",
      ],
      [
        "Plantar metatarsophalangeal ligaments",
        "ligament",
        "Thick plantar plates under the metatarsophalangeal joints.",
      ],
      [
        "Deep transverse metatarsal ligament",
        "ligament",
        "Joins the plantar plates of all five metatarsophalangeal joints, tying the metatarsal heads together.",
      ],
      [
        "Articular capsule of interphalangeal joint of great toe",
        "capsule",
        "The capsule of the single joint of the big toe.",
      ],
      [
        "Articular capsules of proximal interphalangeal joints of foot",
        "capsule",
        "The capsules of the first joints of the lesser toes.",
      ],
      [
        "Articular capsules of distal interphalangeal joints of foot",
        "capsule",
        "The capsules of the toe joints nearest the tips.",
      ],
      [
        "Collateral interphalangeal ligaments of foot",
        "ligament",
        "Strengthen the sides of the toe joints.",
      ],
      [
        "Plantar interphalangeal ligaments",
        "ligament",
        "Plantar plates under the toe joints.",
      ],
    ],
  ],
]

// Consecutive disc names between two vertebral levels, such as C2-C3 to C7-T1.
const intervertebralDiscs = (from: string, to: string) => {
  const order = [
    ...[2, 3, 4, 5, 6, 7].map((n) => `C${n}`),
    ...Array.from({ length: 12 }, (_, n) => `T${n + 1}`),
    ...[1, 2, 3, 4, 5].map((n) => `L${n}`),
    "S1",
  ]
  const levels = order.slice(order.indexOf(from), order.indexOf(to) + 1)
  return levels
    .slice(0, -1)
    .map((level, i) => `Intervertebral_disc_${level}-${levels[i + 1]}`)
}

const discs = (
  [
    ["Cervical", "C2", "T1"],
    ["Thoracic", "T1", "L1"],
    ["Lumbar", "L1", "S1"],
  ] as const
).map(([region, from, to]) => {
  const sources = intervertebralDiscs(from, to)
  const range = (name: string) =>
    name.replace("Intervertebral_disc_", "").replace("-", "–")
  return {
    id: `${region.toLowerCase()}-intervertebral-discs`,
    label: `${region} intervertebral discs`,
    group: "Vertebral column",
    kind: "fibrocartilage" as const,
    description: `The ${sources.length} discs from ${range(sources[0])} to ${range(sources.at(-1)!)}. Each has a fibrous ring, the anulus fibrosus, around a soft core.`,
    sources,
  }
})

const sourceName = (label: string) =>
  label.replace(/ /g, "_").replace(/^./, (c) => c.toUpperCase())
const slug = (label: string) =>
  label
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const capitalize = (label: string) =>
  label.replace(/\((\w)/, (_, c: string) => `(${c.toUpperCase()}`)

export const catalog: Entry[] = groups.flatMap(([group, rows]) => {
  const entries = rows.map(([label, kind, description, sources]) => ({
    id: slug(label),
    label,
    group,
    kind,
    description,
    sources: sources ?? [capitalize(sourceName(label))],
  }))
  if (group !== "Vertebral column") return entries
  // The discs sit before the sacrococcygeal symphysis, the last row.
  return [...entries.slice(0, -1), ...discs, entries.at(-1)!]
})

catalog.push(
  ...(
    [
      [
        "Skull, hyoid and larynx",
        ["Craniumg", "Extracranial_bones_of_headg", "Laryngeal_cartilagesg"],
      ],
      ["Vertebrae", ["Vertebral_columng"]],
      ["Thoracic cage", ["Thoracic_skeletong"]],
      ["Bones of shoulder girdle and arm", ["Bones_of_upper_limbg"]],
      ["Hip bones", ["Bones_of_pelvic_girdleg"]],
      ["Bones of leg and foot", ["Bones_of_free_part_of_lower_limbg"]],
    ] as const
  ).map(([label, bones]) => ({
    id: slug(label),
    label,
    group: "Bones",
    kind: "bone" as const,
    description:
      "Bones shown for context, simplified from the same Z-Anatomy model. The skeleton component has every bone on its own.",
    bones: [...bones],
  }))
)
