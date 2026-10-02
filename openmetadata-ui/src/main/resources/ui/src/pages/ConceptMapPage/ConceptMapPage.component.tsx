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
 

import { RightOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Drawer,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/PageHeader/PageHeader.component';
import PageLayoutV1 from '../../components/PageLayoutV1/PageLayoutV1';
import {
  ConceptDashboard,
  ConceptFront,
  ConceptTag,
  CONCEPT_FRONTS,
  dashboardHref,
  glossaryHref,
  OWNER_TEAM,
  PRODUCT_DICTIONARY_HREF,
  tableHref,
  Tone,
} from './conceptMapData';

const { Text, Title, Paragraph } = Typography;

const TONE_STYLE: Record<Tone, { bg: string; fg: string }> = {
  grain: { bg: '#e5efff', fg: '#1458c0' },
  paid: { bg: '#ffdcf6', fg: '#9c2a7c' },
  trial: { bg: '#ffe7d0', fg: '#b54708' },
  free: { bg: '#fff7d2', fg: '#8a6116' },
  product: { bg: '#fce9ff', fg: '#7a1fa2' },
  usage: { bg: '#ffdddd', fg: '#b42318' },
  neutral: { bg: '#eef1f5', fg: '#5a6578' },
};

const frontCount = (f: ConceptFront): number =>
  f.subfronts.reduce((m, s) => m + s.dashboards.length, 0);

const colorTag = (t: ConceptTag): JSX.Element => {
  const s = TONE_STYLE[t.tone];

  return (
    <Tag
      key={`${t.tone}-${t.label}`}
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        border: 'none',
        borderRadius: 6,
        fontSize: 12,
        marginInlineEnd: 6,
        padding: '2px 9px',
      }}>
      {t.label}
    </Tag>
  );
};

type View = { mode: 'fronts' } | { mode: 'front'; front: ConceptFront };

const ConceptMapPage = ({ pageTitle }: { pageTitle: string }) => {
  const { t } = useTranslation();
  const [view, setView] = useState<View>({ mode: 'fronts' });
  const [detail, setDetail] = useState<ConceptDashboard | null>(null);
  const [picks, setPicks] = useState<ConceptDashboard[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const togglePick = (d: ConceptDashboard, on: boolean): void => {
    setPicks((prev) => {
      if (on) {
        return [...prev.filter((p) => p.fqn !== d.fqn), d].slice(-2);
      }

      return prev.filter((p) => p.fqn !== d.fqn);
    });
  };

  const isPicked = (d: ConceptDashboard): boolean =>
    picks.some((p) => p.fqn === d.fqn);

  const renderCard = (d: ConceptDashboard): JSX.Element => (
    <Card
      bodyStyle={{ padding: 16 }}
      className="concept-card"
      key={d.fqn}
      style={{ borderRadius: 10, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <a
          href={dashboardHref(d.fqn)}
          rel="noopener noreferrer"
          style={{ fontSize: 15, fontWeight: 600 }}
          target="_blank">
          {d.name}
        </a>
        <Text
          style={{ color: '#5a6578', display: 'block', fontSize: 13, marginTop: 6 }}>
          {d.answers}
        </Text>
        <div style={{ marginTop: 12 }}>{d.tags.map(colorTag)}</div>
        <div
          style={{
            alignItems: 'center',
            borderTop: '1px solid #f0f2f5',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingTop: 12,
          }}>
          <Checkbox
            checked={isPicked(d)}
            disabled={!isPicked(d) && picks.length >= 2}
            onChange={(e) => togglePick(d, e.target.checked)}>
            <Text style={{ fontSize: 13 }}>{t('label.compare')}</Text>
          </Checkbox>
          <Button
            size="small"
            type="link"
            onClick={() => setDetail(d)}>
            Details
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderFronts = (): JSX.Element => (
    <Row gutter={[16, 16]}>
      {CONCEPT_FRONTS.map((f) => (
        <Col key={f.key} lg={6} md={8} sm={12} xs={24}>
          <Card
            hoverable
            bodyStyle={{ padding: 18 }}
            className="concept-front-tile"
            style={{ borderRadius: 10, height: '100%' }}
            onClick={() => setView({ mode: 'front', front: f })}>
            <Title level={5} style={{ marginBottom: 6 }}>
              {f.name}
            </Title>
            <Text style={{ color: '#5a6578', fontSize: 13 }}>
              {f.description}
            </Text>
            <div style={{ color: '#1570ef', fontSize: 12, marginTop: 14 }}>
              {frontCount(f)} {t('label.dashboard-plural')} <RightOutlined style={{ fontSize: 10 }} />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderFront = (f: ConceptFront): JSX.Element => (
    <div>
      <Title level={4} style={{ marginBottom: 2 }}>
        {f.name}
      </Title>
      <Paragraph style={{ color: '#5a6578', maxWidth: 680 }}>
        {f.description}
      </Paragraph>
      {f.subfronts.map((s) => (
        <div key={s.name} style={{ marginTop: 24 }}>
          <Text strong style={{ fontSize: 15 }}>
            {s.name}
          </Text>
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            {s.dashboards.map((d) => (
              <Col key={d.fqn} lg={8} md={12} sm={24} xs={24}>
                {renderCard(d)}
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );

  const facetByTone = (d: ConceptDashboard, tones: Tone[]): string => {
    const found = d.tags.find((tg) => tones.includes(tg.tone));

    return found ? found.label : '—';
  };

  const compareRows = useMemo(() => {
    if (picks.length !== 2) {
      return [];
    }
    const [a, b] = picks;
    const row = (facet: string, va: string, vb: string) => ({
      a: va,
      b: vb,
      differ: va !== vb,
      facet,
      key: facet,
    });

    return [
      row('Business question', a.answers, b.answers),
      row('Counts', facetByTone(a, ['grain']), facetByTone(b, ['grain'])),
      row(
        "Who's included",
        facetByTone(a, ['paid', 'trial', 'free']),
        facetByTone(b, ['paid', 'trial', 'free'])
      ),
      row('Products', facetByTone(a, ['product']), facetByTone(b, ['product'])),
      row('Good to know', a.caveat ?? '—', b.caveat ?? '—'),
      row('Owner', OWNER_TEAM, OWNER_TEAM),
      row('Trusted model', a.model, b.model),
    ];
  }, [picks]);

  const similarity = useMemo(() => {
    if (picks.length !== 2) {
      return null;
    }
    const [a, b] = picks;
    const axes: Tone[][] = [['grain'], ['paid', 'trial', 'free'], ['product']];
    const diffs = axes.filter(
      (ax) => facetByTone(a, ax) !== facetByTone(b, ax)
    ).length;
    const level = diffs <= 1 ? 'High' : diffs <= 2 ? 'Medium' : 'Low';
    const color =
      level === 'High' ? '#067647' : level === 'Medium' ? '#1570ef' : '#b54708';
    const diffLabels = axes
      .filter((ax) => facetByTone(a, ax) !== facetByTone(b, ax))
      .map((ax) =>
        ax.includes('grain')
          ? 'what they count'
          : ax.includes('product')
          ? 'products'
          : 'who is included'
      );
    const sentence =
      diffLabels.length === 0
        ? 'These dashboards share the same definitions, so their numbers should line up closely.'
        : `These dashboards are not expected to match exactly because they differ in ${diffLabels.join(
            ' and '
          )}.`;

    return { color, level, sentence };
  }, [picks]);

  const compareColumns: ColumnsType<{
    a: string;
    b: string;
    differ: boolean;
    facet: string;
    key: string;
  }> = [
    {
      dataIndex: 'facet',
      key: 'facet',
      render: (v: string, r) => (
        <Text strong={r.differ} style={{ color: r.differ ? '#1570ef' : '#8c97a8', fontSize: 12 }}>
          {v}
        </Text>
      ),
      title: 'Facet',
      width: '20%',
    },
    { dataIndex: 'a', key: 'a', title: picks[0]?.name ?? 'A' },
    { dataIndex: 'b', key: 'b', title: picks[1]?.name ?? 'B' },
  ];

  return (
    <PageLayoutV1 pageTitle={pageTitle}>
      <Row className="p-x-md p-t-md">
        <Col span={24}>
          {view.mode === 'front' && (
            <Breadcrumb style={{ marginBottom: 12 }}>
              <Breadcrumb.Item>
                <a onClick={() => setView({ mode: 'fronts' })}>
                  {t('label.concept-map')}
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{view.front.name}</Breadcrumb.Item>
            </Breadcrumb>
          )}

          <PageHeader
            data={{
              header: t('label.concept-map'),
              subHeader:
                'Explore analytics topics and find trusted dashboards. Only dashboards whose dbt model is Gold-certified appear here. Links open the real catalog pages.',
            }}
          />

          <div style={{ marginTop: 8 }}>
            <a
              href={PRODUCT_DICTIONARY_HREF}
              rel="noopener noreferrer"
              style={{ fontSize: 13 }}
              target="_blank">
              Browse the Newsela Product Data Dictionary →
            </a>
          </div>

          <div style={{ marginTop: 20 }}>
            {view.mode === 'fronts' ? renderFronts() : renderFront(view.front)}
          </div>
        </Col>
      </Row>

      {picks.length > 0 && (
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid #d3d9e2',
            bottom: 0,
            boxShadow: '0 -4px 16px rgba(27,34,48,.08)',
            left: 0,
            padding: '12px 20px',
            position: 'fixed',
            right: 0,
            zIndex: 20,
          }}>
          <Space wrap>
            <Text type="secondary">{t('label.compare')}:</Text>
            {picks.map((p) => (
              <Tag closable key={p.fqn} onClose={() => togglePick(p, false)}>
                {p.name}
              </Tag>
            ))}
            <Button onClick={() => setPicks([])}>{t('label.clear')}</Button>
            <Button
              disabled={picks.length !== 2}
              type="primary"
              onClick={() => setShowCompare(true)}>
              {t('label.compare')} ({picks.length})
            </Button>
          </Space>
        </div>
      )}

      <Drawer
        open={Boolean(detail)}
        title={detail?.name}
        width={520}
        onClose={() => setDetail(null)}>
        {detail && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>In plain words</Text>
              <Paragraph style={{ marginTop: 6 }}>{detail.answers}</Paragraph>
              <div>{detail.tags.map(colorTag)}</div>
              {detail.caveat && (
                <Paragraph style={{ color: '#b54708', marginTop: 12 }}>
                  <Text strong style={{ color: '#b54708' }}>
                    Good to know:{' '}
                  </Text>
                  {detail.caveat}
                </Paragraph>
              )}
            </div>
            <div>
              <Text strong>From the catalog</Text>
              <Paragraph style={{ color: '#5a6578', marginBottom: 6, marginTop: 6 }}>
                Owner: {OWNER_TEAM} · Certification: Gold (dbt model)
              </Paragraph>
              <Space direction="vertical" size={6}>
                <a href={dashboardHref(detail.fqn)} rel="noopener noreferrer" target="_blank">
                  Open dashboard in catalog →
                </a>
                <a href={tableHref(detail.model)} rel="noopener noreferrer" target="_blank">
                  Trusted model: {detail.model} →
                </a>
                {detail.glossary?.map((g) => (
                  <a
                    href={glossaryHref(g.term)}
                    key={g.term}
                    rel="noopener noreferrer"
                    target="_blank">
                    Glossary: {g.label} →
                  </a>
                ))}
              </Space>
            </div>
            <Button
              block
              type="primary"
              onClick={() => {
                togglePick(detail, true);
                setDetail(null);
              }}>
              {t('label.add-entity', { entity: t('label.compare') })}
            </Button>
          </Space>
        )}
      </Drawer>

      <Drawer
        open={showCompare}
        title={t('label.compare')}
        width={720}
        onClose={() => setShowCompare(false)}>
        {picks.length === 2 && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Table
              columns={compareColumns}
              dataSource={compareRows}
              pagination={false}
              size="small"
            />
            {similarity && (
              <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
                <Tag
                  style={{
                    backgroundColor: `${similarity.color}18`,
                    border: `1px solid ${similarity.color}55`,
                    color: similarity.color,
                    fontWeight: 600,
                  }}>
                  Expected similarity: {similarity.level}
                </Tag>
                <Paragraph style={{ marginBottom: 0, marginTop: 10 }}>
                  {similarity.sentence}
                </Paragraph>
              </Card>
            )}
            <Space>
              {picks.map((p) => (
                <a href={dashboardHref(p.fqn)} key={p.fqn} rel="noopener noreferrer" target="_blank">
                  Open {p.name} →
                </a>
              ))}
            </Space>
          </Space>
        )}
      </Drawer>
    </PageLayoutV1>
  );
};

export default ConceptMapPage;
