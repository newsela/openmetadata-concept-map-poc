/*
 *  Copyright 2026 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

export const OM_HOST = 'https://openmetadata.dev.newseladev.com';
const DATASET = 'newsela-rattle-bigquery.newsela-rattle-dev.main_analytics';

export type Tone =
  | 'grain'
  | 'paid'
  | 'trial'
  | 'free'
  | 'product'
  | 'usage'
  | 'neutral';

export interface ConceptTag {
  label: string;
  tone: Tone;
}

export interface ConceptDashboard {
  name: string;
  fqn: string;
  model: string;
  answers: string;
  tags: ConceptTag[];
  caveat?: string;
  glossary?: Array<{ label: string; term: string }>;
}

export interface ConceptSubfront {
  name: string;
  dashboards: ConceptDashboard[];
}

export interface ConceptFront {
  key: string;
  name: string;
  description: string;
  subfronts: ConceptSubfront[];
}

export const dashboardHref = (fqn: string): string =>
  `${OM_HOST}/dashboard/${encodeURIComponent(fqn)}`;

export const tableHref = (model: string): string =>
  `${OM_HOST}/table/${encodeURIComponent(`${DATASET}.${model}`)}`;

export const glossaryHref = (term: string): string =>
  `${OM_HOST}/glossary/${encodeURIComponent(term)}`;

export const PRODUCT_DICTIONARY_HREF = glossaryHref('Product Data Dictionary');

const T = (label: string, tone: Tone): ConceptTag => ({ label, tone });

export const CONCEPT_FRONTS: ConceptFront[] = [
  {
    key: 'engagement',
    name: 'Engagement',
    description:
      'How active and engaged teachers and students are on paying accounts.',
    subfronts: [
      {
        name: 'Teacher & student engagement',
        dashboards: [
          {
            name: 'Buyer Insights - Teacher Engagement',
            fqn: 'newsela-rattle-tableau.9e769f76-259c-41e0-a566-9232064fcfc9',
            model: 'report_buyer_insights_teacher_insights',
            answers:
              'Who can use Newsela on a paying account now, and how active are teachers?',
            tags: [T('Teachers', 'grain'), T('Paid + trials', 'trial'), T('All products', 'product')],
            caveat:
              'This is an access count, not a paid count — trials and non-core products can be included.',
            glossary: [
              { label: 'Active teacher', term: 'Product Data Dictionary.teacherLifecycle.activated' },
            ],
          },
          {
            name: 'Buyer Insights - Student Engagement',
            fqn: 'newsela-rattle-tableau.9e1626cc-ba84-45e4-aa8a-046b7ac648ef',
            model: 'report_buyer_insights_student_insights',
            answers:
              'Which students can use Newsela on a paying account, and how active are they?',
            tags: [T('Students', 'grain'), T('Paid + trials', 'trial'), T('All products', 'product')],
            caveat:
              "A student's access comes from their school, district or teacher — never owned directly.",
          },
          {
            name: 'Buyer Insights - Teacher Article Engagement',
            fqn: 'newsela-rattle-tableau.1cb58447-eb75-46ff-b5ec-9739fb996031',
            model: 'report_buyer_insights_teacher_insights',
            answers: 'Which content teachers engage with on a paying account.',
            tags: [T('Teachers', 'grain'), T('All products', 'product')],
          },
        ],
      },
      {
        name: 'Teacher activation & coverage',
        dashboards: [
          {
            name: 'Buyer Insights - % Active Teachers',
            fqn: 'newsela-rattle-tableau.709233b7-17d8-4819-bace-a63fa2614285',
            model: 'report_buyer_insights_percentage_active_teacher',
            answers: "What share of a buyer's teachers are active.",
            tags: [T('Teachers', 'grain'), T('Paid only', 'paid')],
          },
          {
            name: 'Buyer Insights - Inactive Teachers',
            fqn: 'newsela-rattle-tableau.4d83bd0e-0893-40f4-b6c5-5264e323fd19',
            model: 'report_buyer_insights_inactive_teachers_by_week',
            answers: 'Which teachers on a paying account have gone inactive.',
            tags: [T('Teachers', 'grain'), T('Paid only', 'paid')],
          },
          {
            name: 'Buyer Insights - School Level Data',
            fqn: 'newsela-rattle-tableau.9da7d273-cb32-4b59-b3d0-b4bb8906b7e9',
            model: 'report_buyer_insights_school_insights',
            answers: 'Teacher activity rolled up to each school on a buyer account.',
            tags: [T('Schools', 'grain'), T('Paid only', 'paid')],
          },
        ],
      },
      {
        name: 'Daily activity lifecycle',
        dashboards: [
          {
            name: 'Activity & Engagement Metrics',
            fqn: 'newsela-rattle-tableau.fa86612d-cd18-4125-a16f-a264a39d3fb5',
            model: 'report_admin_activity_engagement_metrics_by_day',
            answers: 'How many users are active versus engaged over time.',
            tags: [T('Users / day', 'grain'), T('Everyone (incl. free)', 'free')],
            caveat:
              'Active and engaged use different definitions; this is a daily time series.',
          },
        ],
      },
    ],
  },
  {
    key: 'usage',
    name: 'Product & content usage',
    description: 'Which products and which content people actually use.',
    subfronts: [
      {
        name: 'Product usage',
        dashboards: [
          {
            name: 'STEM Usage Report',
            fqn: 'newsela-rattle-tableau.71c5daa6-f467-4362-8fb8-abe34849b1ce',
            model: 'report_buyer_insights_student_insights',
            answers: 'How STEM content is used across accounts.',
            tags: [T('Students', 'grain'), T('All products', 'product')],
          },
          {
            name: 'Newsela Writing Engagement by District',
            fqn: 'newsela-rattle-tableau.00b337a0-f9c8-416e-a06a-b453db0cd42c',
            model: 'report_writing_scores_by_distict_school_teacher_student_agg',
            answers: 'How districts use Newsela Writing.',
            tags: [T('Districts', 'grain')],
          },
        ],
      },
      {
        name: 'Content performance & standards',
        dashboards: [
          {
            name: 'Article and Collection Tracking Report',
            fqn: 'newsela-rattle-tableau.c3f41ec4-6191-4c9f-8e92-4275e4fe1fbe',
            model: 'report_article_stream_usage',
            answers: 'How individual articles and collections are read.',
            tags: [T('Content', 'neutral')],
          },
          {
            name: 'Standards Coverage Report',
            fqn: 'newsela-rattle-tableau.d96d5c93-e751-4a19-969b-269b01cbf89f',
            model: 'report_standards_coverage',
            answers: 'Which academic standards the content covers.',
            tags: [T('Content', 'neutral')],
          },
          {
            name: 'Recurrent Partner Report',
            fqn: 'newsela-rattle-tableau.e7888fc9-895f-4249-bbbb-0ba38ac57679',
            model: 'report_langston_recurrent_partner_content_usage',
            answers: 'Content usage for recurring partners.',
            tags: [T('Content', 'neutral')],
          },
        ],
      },
    ],
  },
  {
    key: 'district',
    name: 'School & district usage',
    description:
      'Where usage happened, credited to the right school or district — includes everyone, not only paid.',
    subfronts: [
      {
        name: 'District & school usage',
        dashboards: [
          {
            name: 'District Insights - Teacher Insights',
            fqn: 'newsela-rattle-tableau.468551b6-dd70-456f-b8e5-44bb0f0f6a44',
            model: 'report_district_insights_teacher_insights',
            answers: "How a district's teachers use Newsela.",
            tags: [T('Teachers (by district)', 'grain'), T('Everyone (incl. free)', 'free')],
            caveat:
              'No paid filter — license is shown as a label, so free users are counted too.',
          },
          {
            name: 'District Insights - Student Insights',
            fqn: 'newsela-rattle-tableau.ad0a2f38-b56b-413c-bd97-71a90e33a71f',
            model: 'report_district_insights_student_insights',
            answers: "How a district's students use Newsela.",
            tags: [T('Students (by district)', 'grain'), T('Everyone (incl. free)', 'free')],
          },
          {
            name: 'District Insights - School Insights',
            fqn: 'newsela-rattle-tableau.cec1528c-d332-45df-b662-910cee3114ea',
            model: 'report_district_insights_school_insights',
            answers: 'How each school in a district uses Newsela.',
            tags: [T('Schools (by district)', 'grain'), T('Everyone (incl. free)', 'free')],
          },
        ],
      },
    ],
  },
  {
    key: 'trials',
    name: 'Trials & conversion',
    description:
      "Who's trialing or using without paying yet, and whether they convert.",
    subfronts: [
      {
        name: 'Whitespace & win-back',
        dashboards: [
          {
            name: 'Conversion Opportunity Report',
            fqn: 'newsela-rattle-tableau.c020911b-11a1-4982-b96d-1f0fab22a0a1',
            model: 'report_conversion_opportunity',
            answers: 'Which trial or prospect teachers look ready to convert to paid.',
            tags: [T('Teachers / districts', 'grain'), T('Trials & prospects', 'trial'), T('Usage-based', 'usage')],
            caveat: 'A usage-based opportunity signal, not an entitlement count.',
          },
        ],
      },
      {
        name: 'Product-qualified leads',
        dashboards: [
          {
            name: 'Product Qualified Lead Diagnostic',
            fqn: 'newsela-rattle-tableau.13d809bf-7b2f-440c-b7e0-680e8fa6370d',
            model: 'report_product_qualified_lead_diagnostic',
            answers: 'Which usage signals flag a product-qualified lead.',
            tags: [T('Teachers', 'grain'), T('Usage-based', 'usage')],
          },
        ],
      },
    ],
  },
  {
    key: 'returning',
    name: 'Returning accounts & renewals',
    description:
      'Did the paying account come back and renew year over year.',
    subfronts: [
      {
        name: 'Returning accounts',
        dashboards: [
          {
            name: 'SY over SY Returning Account Metrics',
            fqn: 'newsela-rattle-tableau.8951fef4-c6a1-4050-a413-32fb20773373',
            model: 'report_returning_account_metrics_by_month',
            answers:
              'Did a paying account come back and renew this school year versus last.',
            tags: [T('Accounts', 'grain'), T('Paid only', 'paid'), T('Core products', 'product')],
            caveat:
              'Accounts that renewed only on a flexible / coupon license can be missed.',
            glossary: [
              { label: 'Returning account', term: 'Product Data Dictionary.organizationLifecycle.accountActivated' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'finance',
    name: 'Finance & bookings',
    description: 'What we sold and booked, and how revenue tracks to plan.',
    subfronts: [
      {
        name: 'Revenue & plan',
        dashboards: [
          {
            name: 'GAAP Revenue Transaction Timing',
            fqn: 'newsela-rattle-tableau.683e4271-4766-40fd-ab22-c21e47a3abe7',
            model: 'report_generation_genius_transactions_info',
            answers: 'When revenue is recognized under GAAP.',
            tags: [T('Revenue', 'neutral')],
          },
        ],
      },
      {
        name: 'eCommerce / self-serve',
        dashboards: [
          {
            name: 'eCommerce_Internal Finance',
            fqn: 'newsela-rattle-tableau.27da6dfe-b595-4d84-9b02-b55bcdec0e02',
            model: 'report_generation_genius_transactions_info',
            answers: 'Self-serve eCommerce finance.',
            tags: [T('Revenue', 'neutral')],
          },
          {
            name: 'eCommerce Generation Genius Metrics',
            fqn: 'newsela-rattle-tableau.e4b8d0e3-573e-44ac-a13c-e34af7c632ce',
            model: 'report_generation_genius_transactions_info',
            answers: 'Generation Genius eCommerce metrics.',
            tags: [T('Revenue', 'neutral')],
          },
          {
            name: 'Ending 25 Export',
            fqn: 'newsela-rattle-tableau.4a16acb7-c1eb-4ea6-9133-bee31c73a9c8',
            model: 'report_generation_genius_transactions_info',
            answers: 'End-of-year transactions export (Generation Genius).',
            tags: [T('Export', 'neutral')],
          },
        ],
      },
    ],
  },
  {
    key: 'marketing',
    name: 'Marketing & demand',
    description: 'Where leads and demand come from.',
    subfronts: [
      {
        name: 'Top of funnel & sources',
        dashboards: [
          {
            name: 'Marketing Source',
            fqn: 'newsela-rattle-tableau.62bc812d-b96b-4d27-be39-21a00deddaaa',
            model: 'report_marketing_mql_sql_metrics',
            answers: 'Where leads and demand originate.',
            tags: [T('Leads', 'neutral')],
          },
        ],
      },
    ],
  },
  {
    key: 'cs',
    name: 'Customer success',
    description: 'How CSMs manage their book of accounts.',
    subfronts: [
      {
        name: 'CSM book management',
        dashboards: [
          {
            name: 'CS Team Management',
            fqn: 'newsela-rattle-tableau.c75ed328-384e-4fab-be17-74a7758bd13c',
            model: 'report_cs_team_management',
            answers: 'How CSMs manage their book of accounts.',
            tags: [T('Accounts', 'grain')],
          },
        ],
      },
    ],
  },
  {
    key: 'other',
    name: 'Other',
    description: 'Internal or operational dashboards.',
    subfronts: [
      {
        name: 'Operational',
        dashboards: [
          {
            name: 'Data Quality Checks',
            fqn: 'newsela-rattle-tableau.f5c8a379-cc25-477f-9cf1-b98ff9ae151b',
            model: 'report_generation_genius_transactions_info',
            answers: 'Internal data-quality monitoring.',
            tags: [T('Internal', 'neutral')],
          },
        ],
      },
    ],
  },
];

export const OWNER_TEAM = 'Data Analytics';
export const GOLD_COUNT = CONCEPT_FRONTS.reduce(
  (n, f) => n + f.subfronts.reduce((m, s) => m + s.dashboards.length, 0),
  0
);
