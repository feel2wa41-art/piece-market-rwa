import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AssetImage} from '../../components/common';
import {useAssetStore} from '../../store/useAssetStore';
import {formatUSDC} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'AssetCertificate'>;

export function AssetCertificateScreen({route}: Props) {
  const {t} = useTranslation();
  const {assetId} = route.params;
  const assets = useAssetStore(s => s.assets);
  const asset = assets.find(a => a.id === assetId);

  if (!asset) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding: SPACING.xl}}>{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  const custody = asset.custody;
  const chain = asset.onChainProof;
  const legal = asset.legalRights;
  const music = asset.musicRights;
  const isMusic = asset.category === 'MUSIC_RIGHTS';
  const verifiedDate = custody?.verifiedAt
    ? new Date(custody.verifiedAt).toLocaleDateString()
    : '-';
  const musicRegDate = music?.registeredAt
    ? new Date(music.registeredAt).toLocaleDateString()
    : '-';

  const monitoringLabel = custody?.monitoring === 'BOTH'
    ? t('certificate.monitoringBoth')
    : custody?.monitoring === 'CCTV_24H'
      ? t('certificate.monitoringCctv')
      : t('certificate.monitoringAudit');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Asset Header */}
        <View style={styles.assetHeader}>
          <View style={styles.assetImage}>
            <AssetImage source={asset.imageUrl} />
          </View>
          <View style={styles.assetMeta}>
            <Text style={styles.assetTitle} numberOfLines={2}>{asset.title}</Text>
            <Text style={styles.assetSeller}>
              {asset.seller.name} {asset.seller.verified ? '✓' : ''}
            </Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>{t('certificate.verified')}</Text>
            </View>
          </View>
        </View>

        {/* Section: Copyright Registration (Music only) */}
        {isMusic && music && (
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>🎵</Text>
            </View>
            <Text style={styles.sectionTitle}>{t('certificate.copyrightTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('certificate.copyrightDesc')}</Text>

            <View style={styles.infoCard}>
              <InfoRow label={t('certificate.regNumber')} value={music.registrationNumber} mono />
              <InfoRow label={t('certificate.registrar')} value={music.registrar} />
              <InfoRow label={t('certificate.copyrightHolder')} value={music.copyrightHolder} />
              <InfoRow label={t('certificate.registeredDate')} value={musicRegDate} />
              <InfoRow label={t('certificate.performer')} value={music.performer} />
              <InfoRow label={t('certificate.composer')} value={music.composer} />
              {music.lyricist && (
                <InfoRow label={t('certificate.lyricist')} value={music.lyricist} />
              )}
            </View>
          </View>
        )}

        {/* Section: AI Production Disclosure (Music only) */}
        {isMusic && music && (
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>🤖</Text>
            </View>
            <Text style={styles.sectionTitle}>{t('certificate.aiDisclosureTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('certificate.aiDisclosureDesc')}</Text>

            <View style={styles.infoCard}>
              <View style={styles.rightRow}>
                <View style={[styles.rightDot, music.aiAssisted ? styles.aiDotWarning : styles.rightDotActive]} />
                <Text style={styles.rightText}>
                  {music.aiAssisted ? t('certificate.aiAssisted') : t('certificate.humanProduced')}
                </Text>
              </View>
              {music.aiAssisted && music.aiTool && (
                <InfoRow label={t('certificate.aiTool')} value={music.aiTool} />
              )}
              <View style={styles.humanContribBox}>
                <Text style={styles.humanContribLabel}>{t('certificate.humanContribution')}</Text>
                <Text style={styles.humanContribText}>{music.humanContribution}</Text>
              </View>
            </View>

            {music.aiAssisted && (
              <View style={styles.aiNotice}>
                <Text style={styles.aiNoticeText}>
                  {t('certificate.aiNotice')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Section: Streaming Revenue (Music only) */}
        {isMusic && music && (
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.sectionTitle}>{t('certificate.streamingTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('certificate.streamingDesc')}</Text>

            <View style={styles.infoCard}>
              <InfoRow
                label={t('certificate.platforms')}
                value={music.streamingPlatforms.join(', ')}
              />
              {music.monthlyStreams !== undefined && (
                <InfoRow
                  label={t('certificate.monthlyStreams')}
                  value={music.monthlyStreams.toLocaleString()}
                />
              )}
              {music.annualRoyalty !== undefined && (
                <InfoRow
                  label={t('certificate.annualRoyalty')}
                  value={formatUSDC(music.annualRoyalty)}
                />
              )}
              <InfoRow
                label={t('certificate.royaltyPerFraction')}
                value={music.annualRoyalty
                  ? formatUSDC(music.annualRoyalty / asset.fractionCount)
                  : '-'}
              />
            </View>
          </View>
        )}

        {/* Section 1: Custody & Storage (Physical assets only) */}
        {!isMusic && custody && (
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>🛡</Text>
            </View>
            <Text style={styles.sectionTitle}>{t('certificate.custodyTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('certificate.custodyDesc')}</Text>

            <View style={styles.infoCard}>
              <InfoRow label={t('certificate.custodian')} value={custody.custodian} />
              <InfoRow label={t('certificate.vaultId')} value={custody.vaultId} mono />
              <InfoRow label={t('certificate.location')} value={custody.location} />
              <InfoRow label={t('certificate.lastVerified')} value={verifiedDate} />
              <InfoRow label={t('certificate.monitoring')} value={monitoringLabel} />
              <InfoRow
                label={t('certificate.insurance')}
                value={`${custody.insuranceProvider} · ${formatUSDC(custody.insuredValue)}`}
              />
            </View>
          </View>
        )}

        {/* Section 2: Legal Rights */}
        {legal && (
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>📜</Text>
            </View>
            <Text style={styles.sectionTitle}>{t('certificate.legalTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('certificate.legalDesc')}</Text>

            <View style={styles.infoCard}>
              <View style={styles.rightRow}>
                <View style={[styles.rightDot, legal.revenueShare && styles.rightDotActive]} />
                <Text style={styles.rightText}>{t('certificate.revenueShare')}</Text>
              </View>
              <View style={styles.rightRow}>
                <View style={[styles.rightDot, legal.liquidationRights && styles.rightDotActive]} />
                <Text style={styles.rightText}>{t('certificate.liquidationRights')}</Text>
              </View>
              {legal.smartContractAuditor && (
                <InfoRow
                  label={t('certificate.auditor')}
                  value={legal.smartContractAuditor}
                />
              )}
              <InfoRow label={t('certificate.governedBy')} value={legal.governedBy} />
            </View>

            <View style={styles.legalNotice}>
              <Text style={styles.legalNoticeText}>
                {t('certificate.legalNotice')}
              </Text>
            </View>
          </View>
        )}

        {/* Section 3: On-Chain Proof */}
        {chain && (
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>⛓</Text>
            </View>
            <Text style={styles.sectionTitle}>{t('certificate.chainTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('certificate.chainDesc')}</Text>

            <View style={styles.infoCard}>
              <InfoRow label={t('certificate.network')} value={chain.network} />
              <InfoRow label={t('certificate.contract')} value={chain.contractAddress} mono />
              <InfoRow label={t('certificate.tokenId')} value={`#${asset.tokenId}`} mono />
              <InfoRow label={t('certificate.standard')} value={chain.tokenStandard} />
              <InfoRow
                label={t('certificate.totalSupply')}
                value={`${asset.fractionCount} ${t('certificate.fractions')}`}
              />
            </View>

            <TouchableOpacity style={styles.explorerButton}>
              <Text style={styles.explorerText}>{t('certificate.viewOnExplorer')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Section 4: Self-Custody Wallet (AA) */}
        <View style={styles.section}>
          <View style={styles.sectionIcon}>
            <Text style={styles.iconText}>🔐</Text>
          </View>
          <Text style={styles.sectionTitle}>{t('certificate.walletTitle')}</Text>
          <Text style={styles.sectionDesc}>{t('certificate.walletDesc')}</Text>

          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>{t('certificate.walletType')}</Text>
            <Text style={styles.walletValue}>Account Abstraction (ERC-4337)</Text>

            <View style={styles.walletDivider} />

            <View style={styles.guaranteeRow}>
              <Text style={styles.guaranteeDot}>✓</Text>
              <Text style={styles.guaranteeText}>{t('certificate.guarantee1')}</Text>
            </View>
            <View style={styles.guaranteeRow}>
              <Text style={styles.guaranteeDot}>✓</Text>
              <Text style={styles.guaranteeText}>{t('certificate.guarantee2')}</Text>
            </View>
            <View style={styles.guaranteeRow}>
              <Text style={styles.guaranteeDot}>✓</Text>
              <Text style={styles.guaranteeText}>{t('certificate.guarantee3')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>{t('certificate.footerNote')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({label, value, mono}: {label: string; value: string; mono?: boolean}) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, mono && infoStyles.mono]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1.5,
    textAlign: 'right',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: FONT_SIZE.xs,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl * 2,
  },
  assetHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.xxl,
  },
  assetImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  assetMeta: {
    flex: 1,
    marginLeft: SPACING.lg,
    justifyContent: 'center',
  },
  assetTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  assetSeller: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  verifiedText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.success,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  iconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  rightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  rightDotActive: {
    backgroundColor: COLORS.success,
  },
  rightText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    flex: 1,
  },
  legalNotice: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  legalNoticeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    lineHeight: 18,
  },
  explorerButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  explorerText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  walletCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  walletLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  walletValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  walletDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xs,
  },
  guaranteeDot: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '700',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  guaranteeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  aiDotWarning: {
    backgroundColor: '#F59E0B',
  },
  humanContribBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  humanContribLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  humanContribText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  aiNotice: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#FFFBEB',
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  aiNoticeText: {
    fontSize: FONT_SIZE.xs,
    color: '#92400E',
    lineHeight: 18,
  },
  footerNote: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  footerNoteText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
