<script setup lang="ts">
import { getNetwork } from '@/networks';
import { _n, shorten } from '@/helpers/utils';
import { NetworkID } from '@/types';
import { VotingPower } from '@/networks/types';

const props = defineProps<{
  open: boolean;
  networkId: NetworkID;
  votingPowerSymbol: string;
  votingPowers: VotingPower[];
  finalDecimals: number;
}>();

defineEmits<{
  (e: 'close');
}>();

const loaded = ref(true);

const network = computed(() => getNetwork(props.networkId));
const baseNetwork = computed(() =>
  network.value.baseNetworkId ? getNetwork(network.value.baseNetworkId) : network.value
);
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3>Your voting power</h3>
    </template>
    <UiLoading v-if="!loaded" class="p-4 block text-center" />
    <div v-else>
      <div
        v-for="(strategy, i) in votingPowers"
        :key="i"
        class="py-3 px-4 border-b last:border-b-0"
      >
        <div class="flex justify-between">
          <a
            :href="network.helpers.getExplorerUrl(strategy.address, 'strategy')"
            target="_blank"
            v-text="network.constants.STRATEGIES[strategy.address] || strategy.address"
          />
          <div class="text-skin-link">
            {{ _n(Number(strategy.value) / 10 ** finalDecimals) }} {{ votingPowerSymbol }}
          </div>
        </div>
        <div class="flex justify-between">
          <a
            v-if="strategy.token"
            :href="baseNetwork.helpers.getExplorerUrl(strategy.token, 'contract', strategy.chainId)"
            target="_blank"
            class="flex items-center text-skin-text"
          >
            <UiStamp :id="strategy.token" type="avatar" :size="18" class="mr-2 rounded-sm" />
            {{ shorten(strategy.token) }}
            <IH-arrow-sm-right class="ml-1 -rotate-45" />
          </a>
          <div v-else />
          <div>
            {{ _n(Number(strategy.value) / 10 ** strategy.decimals) }}
            {{ strategy.symbol || 'units' }}
          </div>
        </div>
      </div>
    </div>
  </UiModal>
</template>
