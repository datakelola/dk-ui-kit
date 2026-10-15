<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let email = $state('');
  let password = $state('');
  let companyId = $state('');
  let companies = $state<{ company_id: string }[]>([]);
  let error = $state('');
  let loading = $state(false);

  function fillDemo() {
    email = 'owner@gotest.id';
    password = 'password123';
  }

  async function submit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      const data = await api.login(email, password, companyId || undefined);
      if ('requires_company_selection' in data) {
        companies = data.companies;
        companyId = companies[0]?.company_id ?? '';
        error = 'Pilih perusahaan lalu tekan Masuk lagi.';
      } else {
        localStorage.setItem('dk_token', data.access_token);
        localStorage.setItem('dk_email', email);
        goto('/home');
      }
    } catch (err) {
      error = (err as Error).message;
    } finally {
      loading = false;
    }
  }

  function enterUiMode() {
    localStorage.setItem('dk_token', 'dev-ui-mode');
    localStorage.setItem('dk_email', email || 'demo@dk-crm.local');
    goto('/home');
  }

  onMount(() => {
    if (localStorage.getItem('dk_token')) goto('/home');
  });
</script>

<svelte:head><title>Login — DK CRM</title></svelte:head>

<div class="flex min-h-svh bg-white dark:bg-slate-950">
  <div class="hidden w-[46%] flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-sky-600 p-12 text-white lg:flex">
    <div class="text-xl font-extrabold tracking-tight">DK CRM</div>
    <div>
      <h1 class="text-4xl font-extrabold leading-tight tracking-tight">Satu platform untuk seluruh percakapan pelanggan.</h1>
      <ul class="mt-8 space-y-3 text-sm">
        {#each ['Threads lintas kanal', 'Ticketing + SLA', 'Email terpadu', 'CSAT & performa agent'] as f}
          <li class="flex items-center gap-3"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-brand-800">✓</span>{f}</li>
        {/each}
      </ul>
    </div>
    <div class="text-xs text-brand-100">Terhubung ke backend Go · :3001</div>
  </div>
  <div class="flex flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
    <div class="w-full max-w-sm">
      <h2 class="text-2xl font-extrabold tracking-tight">Selamat datang</h2>
      <p class="mb-6 text-sm text-slate-500">Masuk untuk mengelola workspace.</p>
      <Card.Root class="p-6">
        <form onsubmit={submit} class="space-y-4">
          <div><Label for="email">Email</Label><Input id="email" bind:value={email} type="email" required /></div>
          <div><Label for="password">Password</Label><Input id="password" bind:value={password} type="password" required /></div>
          {#if companies.length}
            <div><Label for="company">Perusahaan</Label>
              <select id="company" bind:value={companyId} class="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                {#each companies as c}<option value={c.company_id}>{c.company_id}</option>{/each}
              </select>
            </div>
          {/if}
          {#if error}<p class="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>{/if}
          <Button type="submit" class="w-full" disabled={loading}>{loading ? 'Memproses...' : 'Masuk →'}</Button>
          <Button type="button" variant="outline" class="w-full" onclick={enterUiMode}>Masuk mode UI (tanpa backend)</Button>
        </form>
      </Card.Root>
      <Card.Root class="mt-4 p-4 text-xs text-slate-500">
        <div class="mb-1 font-semibold text-slate-700 dark:text-slate-200">Akun demo (klik untuk isi otomatis)</div>
        <button onclick={fillDemo} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-mono dark:border-slate-700 dark:bg-slate-800">owner@gotest.id / password123</button>
      </Card.Root>
    </div>
  </div>
</div>
