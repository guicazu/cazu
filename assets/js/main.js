(() => {
  const form = document.getElementById('formCazu');
  if (!form) return;
  const elCep = document.getElementById('cep');
  const elWhats = document.getElementById('whatsapp');
  const statusBox = document.getElementById('formStatus');
  const cepHint = document.getElementById('cepHint');
  const checkboxConsent = document.getElementById('consent');
  const submitBtn = form.querySelector('button[type="submit"]');
  const resetBtn = form.querySelector('button[type="reset"]');
  const defaultSubmitText = submitBtn ? submitBtn.textContent : 'Enviar';
  let ignoreResetHandler = false;

  const ENDPOINT = (() => {
    const dataAttr = form.dataset.endpoint?.trim();
    if (dataAttr) return dataAttr;
    const meta = document.querySelector('meta[name="flow-endpoint"]');
    if (meta?.content?.trim()) return meta.content.trim();
    const globalValue = typeof window !== 'undefined' ? window.__CAZU_FORM_ENDPOINT__ : '';
    if (typeof globalValue === 'string' && globalValue.trim()) return globalValue.trim();
    return '';
  })();

  function setStatus(state='', text=''){
    if (!statusBox) return;
    if (state) statusBox.dataset.state = state; else statusBox.removeAttribute('data-state');
    statusBox.textContent = text;
    if (text) statusBox.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function setCepHint(text='', state=''){
    if (!cepHint) return;
    if (state) cepHint.dataset.state = state; else cepHint.removeAttribute('data-state');
    cepHint.textContent = text;
  }
  function toggleLoading(isLoading){
    if (submitBtn){ submitBtn.disabled = isLoading; submitBtn.textContent = isLoading ? 'Enviando...' : defaultSubmitText; }
    if (resetBtn) resetBtn.disabled = isLoading;
  }

  if (elWhats){
    elWhats.addEventListener('input', () => {
      let value = elWhats.value.replace(/\D/g,'').slice(0,11);
      if (value.length > 6) elWhats.value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
      else if (value.length > 2) elWhats.value = `(${value.slice(0,2)}) ${value.slice(2)}`;
      else elWhats.value = value;
    });
  }
  if (elCep){
    elCep.addEventListener('input', () => {
      let value = elCep.value.replace(/\D/g,'').slice(0,8);
      elCep.value = value.length > 5 ? `${value.slice(0,5)}-${value.slice(5)}` : value;
      if (value.length < 8) setCepHint();
    });
    elCep.addEventListener('blur', () => buscaCEP(elCep.value));
  }

  async function buscaCEP(cep){
    const numericCep = cep.replace(/\D/g,'');
    setCepHint();
    if (!numericCep) return;
    if (numericCep.length !== 8){ setCepHint('Informe os 8 dígitos do CEP.', 'error'); return; }
    try{
      const response = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
      if (!response.ok) throw new Error('Falha ao consultar o CEP.');
      const data = await response.json();
      if (data.erro){ setCepHint('CEP não encontrado.', 'error'); return; }
      document.getElementById('logradouro').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('cidade').value = data.localidade || '';
      document.getElementById('uf').value = (data.uf || '').toUpperCase();
      setCepHint('Endereço preenchido automaticamente.', 'success');
    }catch(error){ console.error(error); setCepHint('Não foi possível buscar o endereço agora.', 'error'); }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus();
    if (!form.reportValidity()){ setStatus('error','Preencha os campos obrigatórios.'); return; }
    if (!ENDPOINT){ setStatus('error','Configuração de envio ausente. Defina um endpoint seguro em data-endpoint.'); return; }
    const payload = {
      nome: form.nome.value.trim(), email: form.email.value.trim(), whatsapp: form.whatsapp.value.trim(),
      tipoServico: form.tipoServico.value, cep: form.cep.value.trim(), cidade: form.cidade.value.trim(),
      uf: form.uf.value.trim().toUpperCase(), logradouro: form.logradouro.value.trim(), numero: form.numero.value.trim(),
      bairro: form.bairro.value.trim(), detalhes: form.detalhes.value.trim(),
      consent: checkboxConsent?.checked ?? false, submittedAt: new Date().toISOString()
    };
    toggleLoading(true);
    try{
      const response = await fetch(ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      if (!response.ok){ const errorText = await response.text().catch(() => ''); throw new Error(errorText || 'Falha ao enviar os dados.'); }
      setStatus('success', 'Recebemos sua solicitação! Obrigado por entrar em contato.');
      ignoreResetHandler = true; form.reset(); ignoreResetHandler = false; setCepHint(); form.nome?.focus();
    }catch(error){ console.error(error); setStatus('error', 'Não foi possível enviar agora. Tente novamente em instantes.'); }
    finally{ toggleLoading(false); }
  });

  form.addEventListener('reset', () => { if (ignoreResetHandler) return; setStatus(); setCepHint(); });
})();
